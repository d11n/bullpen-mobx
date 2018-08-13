// eslint-disable-next-line max-params
(function main(BULLPEN, MOBX, Store) {
    const { NOOP } = BULLPEN.Collection; // ick
    class Treepen extends BULLPEN.Treepen {
        constructor(...args) {
            return super(...args);
        }
    }
    Object.assign(Treepen.prototype, { perform_operation });
    Object.assign(Treepen, { Store });
    return module.exports = Object.freeze(Treepen);

    // -----------

    function perform_operation(op) {
        const verb = op.verb;
        let getter_result;
        let store_result = get_current_store_result();
        if (store_result && is_full_store_result(store_result)) {
            return prepare_result(store_result);
        }
        // To avoid multiple requests, need to make a queue of "futures"
        // in order to resolve them all at once after a single endpoint call
        return NOOP === get_endpoint_promise()
            ? prepare_result(op.execute_on_store(op.params))
            : prepare_result(store_result)
            ; // eslint-disable-line indent

        // -----------

        function is_full_store_result(result) {
            // When performing an op, retry endpoint if empty store result.
            // It may actually be empty, but no way to know.
            return MOBX.isObservableArray(result)
                ? result.length > 0
                : Object.keys(result) > 0
                ; // eslint-disable-line indent
        }

        function get_current_store_result() {
            'get' === verb && (getter_result = MOBX.observable({}));
            return [ 'get', 'stream' ].includes(verb)
                ? op.execute_on_store()
                : null
                ; // eslint-disable-line indent
        }

        function get_endpoint_promise() {
            const endpoint_promise = op.execute_on_endpoint(op.params);
            NOOP === endpoint_promise && NOOP === store_result
                ? throw_noop_error(verb, op.name)
                : endpoint_promise instanceof Promise
                    ? endpoint_promise.then(process_endpoint_result)
                    : throw_endpoint_return_error(op.endpoint_verb)
                ; // eslint-disable-line indent
            return endpoint_promise;
        }

        function process_endpoint_result(raw_result) {
            store_result = op.execute_on_store(raw_result);
            const result = NOOP === store_result ? raw_result : store_result;
            return prepare_result(result);
        }

        function prepare_result(result) {
            /* eslint-disable indent */
            const prepared_result
                = 'mutate' === verb
                    ? undefined
                : 'get' === verb
                    ? MOBX.extendObservable(getter_result, MOBX.toJS(result))
                : result // 'stream' === verb
                ;
            /* eslint-enable indent */
            return prepared_result;
        }
    }

    // -----------

    function throw_noop_error(verb, op) {
        throw_error(`${ verb }('${ op }') is a noop`);
    }

    function throw_endpoint_return_error(verb) {
        throw_error(`endpoint.${ verb }() must return a Promise or Collection.NOOP`); // eslint-disable-line max-len
    }

    function throw_error(message) {
        throw new Error(`BULLPEN.Treepen: ${ message }`);
    }
}(
    require('bullpen'),
    require('mobx'),
    require('./store'),
));
