// eslint-disable-next-line max-params
(function main(BULLPEN, Collection, Statepen, Treepen) {
    return module.exports = Object.freeze({
        ...BULLPEN,
        Collection,
        Statepen,
        Treepen,
    });
}(
    require('bullpen'),
    require('./collection'),
    require('./statepen'),
    require('./treepen'),
));
