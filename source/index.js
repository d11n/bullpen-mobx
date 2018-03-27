// eslint-disable-next-line max-params
(function main(BULLPEN, Collection) {
    return module.exports = Object.freeze({
        ...BULLPEN,
        ...{ Collection },
        }); // eslint-disable-line indent
}(
    require('bullpen'),
    require('./collection'),
));
