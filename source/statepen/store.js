// eslint-disable-next-line max-params
(function main(BULLPEN, MOBX) {
    class Store extends BULLPEN.Statepen.Store {
        constructor(...args) {
            return super(...args);
        }
    }
    Object.assign(Store.prototype, {
        initialize_struct,
        perform_key_mutation,
    });
    return module.exports = Object.freeze(Store);

    // -----------

    function initialize_struct({ state }) {
        return MOBX.observable({ ...state });
    }

    function perform_key_mutation({ struct, op }) {
        MOBX.extendObservable(struct[op.name], op.params);
        return struct;
    }
}(
    require('bullpen'),
    require('mobx'),
));
