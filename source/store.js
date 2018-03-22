// eslint-disable-next-line max-params
(function main(BULLPEN, MOBX) {
    class Store extends BULLPEN.Collection.Store {
        constructor(...args) {
            return super(...args);
        }
    }
    const { ALL_ITEMS, Query } = BULLPEN.Collection;
    Object.assign(Store.prototype, {
        initialize: (value) => MOBX.observable(value),
        // fetch: fetch_from_store,
        // mutate: mutate_store,
        perform_default_fetch,
        }); // eslint-disable-line indent
    return module.exports = Object.freeze(Store);

    // -----------

    function perform_default_fetch(store_struct, arg0, datasource_payload) {
        /* eslint-disable indent */
        return arg0 instanceof Query ? fetch_query()
            : ALL_ITEMS === arg0 ? fetch_all()
            : fetch_one()
            ;
        /* eslint-enable indent */

        // -----------

        function fetch_query() {
            if (datasource_payload) {
                const substore = store_struct.query_result_dict;
                const key = arg0.query_id;
                const value = JSON.parse(JSON.stringify(datasource_payload));
                if (substore[key]) {
                    substore[key] = value;
                } else {
                    MOBX.extendObservable(substore, { [key]: value });
                }
            }
            return store_struct.query_result_dict[ arg0.query_id ];
        }

        function fetch_all() {
            if (!datasource_payload
                && !store_struct.is_item_list_fully_hydrated
                ) { // eslint-disable-line indent
                throw_error(
                    'datasource could not hydrate the store with all items',
                    ); // eslint-disable-line indent
            } else if (datasource_payload) {
                !Array.isArray(datasource_payload)
                    && throw_error(
                        'datasource attempted to hydrate store with non-array',
                        ) // eslint-disable-line indent
                    ; // eslint-disable-line indent
                store_struct.item_list.replace(datasource_payload);
                store_struct.is_item_list_fully_hydrated = true;
            }
            return store_struct.item_list;
        }

        function fetch_one() {
            let item = datasource_payload;
            if (item) {
                if (arg0 !== item.id) {
                    throw_error('id does not match id fetched from datasource');
                }
                const i = store_struct.item_list.findIndex(
                    (item_in_list) => arg0 === item_in_list.id,
                    ); // eslint-disable-line indent
                -1 === i
                    ? store_struct.item_list.push(item)
                    : store_struct.item_list[i] = item
                    ; // eslint-disable-line indent
            } else {
                item = store_struct.item_list
                    .find((item_in_list) => arg0 === item_in_list.id)
                    ; // eslint-disable-line indent
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
