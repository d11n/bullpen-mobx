// eslint-disable-next-line max-params
(function main(BULLPEN, MOBX, Thin_promise) {
    class Collection extends BULLPEN.Collection {
        constructor(params) {
            params.store_creator = MOBX.observable;
            params.default_operation = perform_default_operation;
            return decorate_instance(super(params));
        }
    }
    return module.exports = Object.freeze(Collection);

    // -----------

    function decorate_instance(this_collection) {
        return this_collection;
    }

    function perform_default_operation(operation, store, make_request) {
        const next_thing = new Thin_promise;
        if (operation.id) {
            const item = store.item_list.find((itm) => operation.id === itm.id);
            if (item) {
                next_thing.do(item);
            } else {
                make_request().then(update_item);
            }
        } else if (operation.query) {
            make_request().then(update_query_result);
        } else if (store.is_item_list_fully_hydrated) {
            next_thing.do(store.item_list);
        } else {
            make_request().then(update_items);
        }
        return next_thing;

        // -----------

        function update_item(item) {
            const i = store.item_list.findIndex((itm) => item.id === itm.id);
            -1 === i
                ? store.item_list.push(item)
                : (store.item_list[i] = item) // eslint-disable-line
                ; // eslint-disable-line indent
            return next_thing.do(item);
        }

        function update_items(items) {
            store.item_list.replace(items);
            store.is_item_list_fully_hydrated = true;
            return next_thing.do(store.item_list);
        }

        function update_query_result(query_result) {
            const substore = store.query_result_dict;
            const key = query_result.name;
            const value = JSON.parse(JSON.stringify(query_result));
            if (substore[key]) {
                substore[key] = value;
            } else {
                MOBX.extendObservable(substore, { [key]: value });
            }
            return next_thing.do(substore[key]);
        }
    }
}(
    require('bullpen'),
    require('mobx'),
    require('bullpen/source/thin-promise'), // do something better than this
));
