// eslint-disable-next-line max-params
(function main(BULLPEN, Collection, Statepen) {
    return module.exports = Object.freeze({
        ...BULLPEN,
        Collection,
        Statepen,
    });
}(
    require('bullpen'),
    require('./collection'),
    require('./statepen'),
));
