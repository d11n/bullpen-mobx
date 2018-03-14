// eslint-disable-next-line max-params
(function main(BULLPEN, Collection) {
    const { Datasource } = BULLPEN;
    return module.exports = Object.freeze({
        Datasource,
        Collection,
        }); // eslint-disable-line indent
}(
    require('bullpen'),
    require('./collection'),
));
