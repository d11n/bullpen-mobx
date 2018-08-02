// eslint-disable-next-line max-params
(function main(BULLPEN, Collection, View) {
    return module.exports = Object.freeze({
        ...BULLPEN,
        ...{ Collection, View },
        }); // eslint-disable-line indent
}(
    require('bullpen'),
    require('./collection'),
    require('./view'),
));
