// eslint-disable-next-line max-params
(function main(BULLPEN, Store) {
    class Collection extends BULLPEN.Collection {
        constructor(...args) {
            return super(...args);
        }
    }
    Collection.Store = Store;
    return module.exports = Object.freeze(Collection);
}(
    require('bullpen'),
    require('./store'),
));
