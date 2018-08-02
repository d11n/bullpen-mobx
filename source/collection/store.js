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
            is_item_list_hydrated: {
                value: false,
                writable: true,
                enumerable: true,
                }, // eslint-disable-line indent
            item_list: { value: [], enumerable: true },
            full_item_list: { value: [], enumerable: true },
            query_result_dict: { value: {}, enumerable: true },
            })); // eslint-disable-line indent
        MOBX.autorun(sync_full_item_list);
        Object.defineProperties(this_store, {
            is_hydrated: {
                get: () => store_struct.is_item_list_hydrated,
                enumerable: true,
                }, // eslint-disable-line indent
            has: {
                value: (id) => Boolean(store_struct.item_dict[id]),
                enumerable: true,
                }, // eslint-disable-line indent
            }); // eslint-disable-line indent
        return store_struct;

        // -----------

        function sync_full_item_list() {
            return store_struct.is_item_list_hydrated
                && store_struct.full_item_list.replace(store_struct.item_list)
                ; // eslint-disable-line indent
            // ^ so wasteful, find a leaner way to achieve the same result
        }
    }

    function perform_default_fetch(store_struct, arg, endpoint_payload) {
        /* eslint-disable indent */
        return arg instanceof Query ? fetch_query()
            : ALL_ITEMS === arg ? fetch_all()
            : fetch_one()
            ;
        /* eslint-enable indent */

        // -----------

        function fetch_query() {
            const key = arg.query_id;
            const query_string = String(arg.query_string);
            const value = store_struct.query_result_dict[key];
            if (endpoint_payload) {
                update_query(arg, endpoint_payload);
            } else if (undefined === value
                || query_string !== value.query_string
                ) { // eslint-disable-line indent
                const query_result_future = new Query_result({
                    query_string: arg.query_string,
                    }); // eslint-disable-line indent
                query_result_future.is_pending = true;
                update_query(arg, query_result_future);
            }
            return store_struct.query_result_dict[key].result;
        }

        function fetch_all() {
            if (endpoint_payload) {
                !Array.isArray(endpoint_payload)
                    && throw_error(
                        'endpoint attempted to hydrate store with non-array',
                        ) // eslint-disable-line indent
                    ; // eslint-disable-line indent
                store_struct.item_list.replace(endpoint_payload);
                store_struct.is_item_list_hydrated = true;
            }
            return store_struct.full_item_list;
        }

        function fetch_one() {
            let item;
            if (endpoint_payload) {
                if (arg !== endpoint_payload.id) {
                    throw_error('id does not match id fetched from endpoint');
                }
                update_item(endpoint_payload);
            } else {
                item = store_struct.item_list.find(find_item);
                if (undefined === item) {
                    update_item({ id: arg, is_pending: true });
                }
            }
            return item || store_struct.item_list.find(find_item);
        }

        function find_item(item) {
            return arg === item.id;
        }

        function update_query(query, raw_result) {
            const key = arg.query_id;
            const query_string = String(arg.query_string);
            const result = JSON.parse(JSON.stringify(raw_result));
            // eslint-disable-next-line no-prototype-builtins
            if (store_struct.query_result_dict.hasOwnProperty(key)) {
                store_struct.query_result_dict[key].query_string = query_string;
                const old_result = store_struct.query_result_dict[key].result;
                return replaceObservable(old_result, result);
            }
            return MOBX.extendObservable(
                store_struct.query_result_dict,
                { [key]: { query_string, result } },
                ); // eslint-disable-line indent
        }

        function update_item(new_item) {
            for (const item of store_struct.item_list) {
                if (arg === item.id) {
                    return replaceObservable(item, new_item);
                }
            }
            return store_struct.item_list.push(new_item);
        }
    }

    // -----------

    function replaceObservable(target, raw_props) {
        const emptied_target = {};
        const keys = Object.keys(target);
        for (const key of keys) {
            emptied_target[key] = undefined;
        }
        const props = 'object' === typeof raw_props
            ? raw_props
            : {
                id: target.id,
                query_string: target.query_string,
                is_null: true,
                } // eslint-disable-line indent
            ; // eslint-disable-line indent
        return MOBX.extendObservable(target, { ...emptied_target, ...props });
    }

    function throw_error(message) {
        throw new Error(`BULLPEN.Collection: ${ message }`);
    }
}(
    require('bullpen'),
    require('mobx'),
));
