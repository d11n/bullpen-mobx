// eslint-disable-next-line max-params
(function main(BULLPEN, MOBX, Store) {
    const { NOOP } = BULLPEN.Collection;
    class Collection extends BULLPEN.Collection {
        constructor(...args) {
            return super(...args);
        }
    }
    Object.assign(Collection.prototype, {
        perform_operation,
        }); // eslint-disable-line indent
    Object.assign(Collection, {
        Store,
        }); // eslint-disable-line indent
    return module.exports = Object.freeze(Collection);

    // -----------

    function perform_operation(op) {
        const verb = op.bullpen_verb;
        let getter_result;
        let store_result = get_current_store_result();
        if (store_result) {
            return prepare_result(store_result);
        }
        return NOOP === get_datasource_promise()
            ? prepare_result(op.execute_on_store(op.params))
            : prepare_result(store_result)
            ; // eslint-disable-line indent

        // -----------

        function get_current_store_result() {
            if ('get' === verb) {
                const initial_value = op.is_for_all_items ? [] : {};
                getter_result = MOBX.observable(initial_value);
            }
            if ([ 'get', 'stream' ].includes(verb)) {
                const result = op.execute_on_store();
                if (NOOP !== result && undefined !== result.id) {
                    return result;
                }
            }
            return null;
        }

        function get_datasource_promise() {
            const datasource_promise = op.execute_on_datasource(op.params);
            if (NOOP === datasource_promise) {
                NOOP === store_result && throw_noop_error(verb, op.name);
                [ 'get', 'stream' ].includes(verb)
                    && undefined !== store_result.id
                    && throw_noop_error(verb, op.name)
                    ; // eslint-disable-line indent
            } else {
                datasource_promise instanceof Promise
                    ? datasource_promise.then(process_datasource_result)
                    : throw_datasource_return_error(op.datasource_verb)
                    ; // eslint-disable-line indent
            }
            return datasource_promise;
        }

        function process_datasource_result(raw_result) {
            debugger;
            store_result = op.execute_on_store(raw_result);
            const result = NOOP === store_result
                ? raw_result
                : store_result
                ;
            return prepare_result(result);
        }

        function prepare_result(result) {
            debugger;
            /* eslint-disable indent */
            return 'mutate' === verb ? undefined
                : 'get' === verb ? MOBX.isObservableArray(getter_result)
                    ? getter_result.replace(result || [])
                    : MOBX.extendObservable(getter_result, result)
                : result
                ;
            /* eslint-enable indent */
        }
    }

    // -----------

    function throw_noop_error(verb, op) {
        throw_error(`${ verb }('${ op }') is a noop`);
    }

    function throw_datasource_return_error(verb) {
        throw_error(
            `datasource.${ verb }() must return a Promise or Collection.NOOP`,
            ); // eslint-disable-line indent
    }

    function throw_error(message) {
        throw new Error(`BULLPEN.Collection: ${ message }`);
    }
}(
    require('bullpen'),
    require('mobx'),
    require('./store'),
));
