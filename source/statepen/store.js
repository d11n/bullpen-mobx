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

    function initialize_struct({ initial_state }) {
        return Object.seal(MOBX.observable({ ...initial_state }));
    }

    function perform_key_mutation({ struct, op_name, op_params }) {
        MOBX.extendObservable(struct[op_name], op_params);
        return struct;
    }
}(
    require('bullpen'),
    require('mobx'),
));
