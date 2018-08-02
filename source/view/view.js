// eslint-disable-next-line max-params
(function main(BULLPEN, Store) {
    class View extends BULLPEN.View {
        constructor(...args) {
            return super(...args);
        }
    }
    Object.assign(View, { Store });
    return module.exports = Object.freeze(View);
}(
    require('bullpen'),
    require('./store'),
));
