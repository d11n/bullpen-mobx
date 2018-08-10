// eslint-disable-next-line max-params
(function main(BULLPEN, Store) {
    class Statepen extends BULLPEN.Statepen {
        constructor(...args) {
            return super(...args);
        }
    }
    Object.assign(Statepen, { Store });
    return module.exports = Object.freeze(Statepen);
}(
    require('bullpen'),
    require('./store'),
));
