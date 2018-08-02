// eslint-disable-next-line max-params
(function main(BULLPEN, MOBX) {
    class Store extends BULLPEN.View.Store {
        constructor(...args) {
            return super(...args);
        }
    }
    Object.assign(Store.prototype, { initialize_struct });
    return module.exports = Object.freeze(Store);

    // -----------

    function initialize_struct({ store, initial_state }) {
        return Object.seal(MOBX.observable({ ...initial_state }));
    }
}(
    require('bullpen'),
    require('mobx'),
));
