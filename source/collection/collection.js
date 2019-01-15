// eslint-disable-next-line max-params
(function main(BULLPEN, MOBX, Store) {
    const { NOOP } = BULLPEN.Collection
    class Collection extends BULLPEN.Collection {
        constructor(...args) {
            return super(...args)
        }
    }
    Object.assign(Collection.prototype, { perform_operation })
    Object.assign(Collection, { Store })
    return module.exports = Object.freeze(Collection)

    ///////////

    function perform_operation(op) {
        const verb = op.verb
        let getter_result
        let store_result = get_current_store_result()
        if (store_result && is_full_store_result(store_result)) {
            return prepare_result(store_result)
        }
        return NOOP === get_endpoint_promise()
            ? prepare_result(op.execute_on_store(op.params))
            : prepare_result(store_result)

        ///////////

        function is_full_store_result(result) {
            return MOBX.isObservableArray(result)
                ? result.length > 0 // full item list
                : !result.is_pending // pending query or item
        }

        function get_current_store_result() {
            if ('get' === verb) {
                const initial_value = op.is_for_all_items ? [] : {}
                getter_result = MOBX.observable(initial_value)
            }
            return [ 'get', 'stream' ].includes(verb)
                ? op.execute_on_store()
                : null
        }

        function get_endpoint_promise() {
            const endpoint_promise = op.execute_on_endpoint(op.params)
            NOOP === endpoint_promise && NOOP === store_result
                ? throw_noop_error(verb, op.name)
                : endpoint_promise instanceof Promise
                    ? endpoint_promise.then(process_endpoint_result)
                    : throw_endpoint_return_error(op.endpoint_verb)
            return endpoint_promise
        }

        function process_endpoint_result(raw_result) {
            store_result = op.execute_on_store(raw_result)
            const result = NOOP === store_result ? raw_result : store_result
            return prepare_result(result)
        }

        function prepare_result(result) {
            /* eslint-disable indent */
            return 'mutate' === verb ? undefined
                : 'get' === verb ? MOBX.isObservableArray(getter_result)
                    ? result && result.length > 0
                        ? getter_result.replace(result)
                        : getter_result
                    : MOBX.extendObservable(getter_result, MOBX.toJS(result))
                : result
            /* eslint-enable indent */
        }
    }

    ///////////

    function throw_noop_error(verb, op) {
        throw_error(`${ verb }('${ op }') is a noop`)
    }

    function throw_endpoint_return_error(verb) {
        throw_error(
            `endpoint.${ verb }() must return a Promise or Collection.NOOP`,
        )
    }

    function throw_error(message) {
        throw new Error(`BULLPEN.Collection: ${ message }`)
    }
}(
    require('bullpen'),
    require('mobx'),
    require('./store'),
))
