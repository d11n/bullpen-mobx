// eslint-disable-next-line max-params
(function main(BULLPEN, MOBX, Store) {
    class Statepen extends BULLPEN.Statepen {
        constructor(...args) {
            return super(...args);
        }
    }
    Object.assign(Statepen.prototype, { perform_operation });
    Object.assign(Statepen, { Store });
    return module.exports = Object.freeze(Statepen);

    // -----------

    function perform_operation(op) {
        const verb = op.verb;
        let getter_result;
        return prepare_result(get_current_store_result());

        // -----------

        function get_current_store_result() {
            'get' === verb && (getter_result = MOBX.observable({}));
            return op.execute_on_store();
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
}(
    require('bullpen'),
    require('mobx'),
    require('./store'),
));
