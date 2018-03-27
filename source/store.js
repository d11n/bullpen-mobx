// eslint-disable-next-line max-params
(function main(BULLPEN, MOBX) {
    const { ALL_ITEMS, Query, Query_result } = BULLPEN.Collection;
    class Store extends BULLPEN.Collection.Store {
        constructor(...args) {
            return super(...args);
        }
    }
    Object.assign(Store.prototype, {
        initialize_store_struct,
        perform_default_fetch,
        }); // eslint-disable-line indent
    return module.exports = Object.freeze(Store);

    // -----------

    function initialize_store_struct(this_store) {
        const store_struct = MOBX.observable(Object.defineProperties({}, {
            is_item_map_hydrated: {
                value: false,
                writable: true,
                enumerable: true,
                }, // eslint-disable-line indent
            item_map: { value: new Map, enumerable: true },
            item_list: { value: MOBX.computed(compute_item_list) },
            query_result_map: { value: new Map, enumerable: true },
            })); // eslint-disable-line indent
        Object.defineProperties(this_store, {
            is_hydrated: {
                get: () => store_struct.is_item_map_hydrated,
                enumerable: true,
                }, // eslint-disable-line indent
            has: {
                value: (id) => Boolean(store_struct.item_map.get(id)),
                enumerable: true,
                }, // eslint-disable-line indent
            }); // eslint-disable-line indent
        return store_struct;

        // -----------

        function compute_item_list() {
            console.log('compute_item_list', this);
            // Until the collection is hydrated, it contains a random subset
            // of items that have been fetched individually.
            // So return an empty array until hydrated.
            return store_struct.is_item_map_hydrated
                ? Array.from(this.item_map.values())
                : []
                ; // eslint-disable-line indent
        }
    }

    function perform_default_fetch(store_struct, arg, datasource_payload) {
        /* eslint-disable indent */
        return arg instanceof Query ? fetch_query()
            : ALL_ITEMS === arg ? fetch_all()
            : fetch_one()
            ;
        /* eslint-enable indent */

        // -----------

        function fetch_query() {
            debugger;
            const key = arg.query_id;
            const query = String(arg.query_string);
            let value;
            if (datasource_payload) {
                const result = JSON.parse(JSON.stringify(datasource_payload));
                store_struct.query_result_map.set(key, { query, result });
            }
            value = store_struct.query_result_map.get(key);
            if (undefined === value) {
                const result = JSON.parse(JSON.stringify(new Query_result));
                store_struct.query_result_map.set(key, { query, result });
                value = store_struct.query_result_map.get(key);
            }
            return value.result;
        }

        function fetch_all() {
            debugger;
            if (datasource_payload) {
                !Array.isArray(datasource_payload)
                    && throw_error(
                        'datasource attempted to hydrate store with non-array',
                        ) // eslint-disable-line indent
                    ; // eslint-disable-line indent
                store_struct.item_map.clear();
                for (const item of datasource_payload) {
                    store_struct.item_map.set(item.id, item);
                }
                store_struct.is_item_map_hydrated = true;
            }
            return store_struct.item_list;
        }

        function fetch_one() {
            debugger;
            let item = datasource_payload;
            if (item) {
                if (arg !== item.id) {
                    throw_error('id does not match id fetched from datasource');
                }
                store_struct.item_map.set(item.id, item);
            } else {
                item = store_struct.item_map.get(arg);
                if (undefined === item) {
                    item = store_struct.item_map.set(arg, {});
                }
            }
            return item;
        }
    }

    // -----------

    function throw_error(message) {
        throw new Error(`BULLPEN.Collection: ${ message }`);
    }
}(
    require('bullpen'),
    require('mobx'),
));
