// eslint-disable-next-line max-params
(function main(BULLPEN, MOBX) {
    class Store extends BULLPEN.Treepen.Store {
        constructor(...args) {
            return super(...args);
        }
    }
    Object.assign(Store.prototype, {
        initialize_struct,
        perform_default_fetch,
        perform_key_fetch,
        }); // eslint-disable-line indent
    return module.exports = Object.freeze(Store);

    // -----------

    function initialize_struct({ store, tree }) {
        const struct = MOBX.observable(Object.defineProperties({}, {
            tree: { value: { ...tree }, enumerable: true },
            is_pending: { value: false, enumerable: true, writable: true },
            is_hydrated: { value: false, enumerable: true, writable: true },
        }));
        Object.defineProperties(store, {
            is_pending: { value: () => struct.is_pending },
        });
        return struct;
    }

    function perform_default_fetch({ struct, data }) {
        ensure_store_is_hydrated({ struct, data });
        return struct.tree;
    }

    function perform_key_fetch({ struct, op, data }) {
        ensure_store_is_hydrated({ struct, data });
        const { key } = op.params;
        // JSON Path?
        return struct.tree[key];
    }

    function ensure_store_is_hydrated({ struct, data }) {
        if (data) {
            const emptied_tree = {};
            for (const key of Object.keys(struct.tree)) {
                emptied_tree[key] = undefined;
            }
            // Order matters a shit-ton here cuz mobx
            MOBX.extendObservable(struct, {
                is_hydrated: true,
                is_pending: false,
                tree: { ...emptied_tree, ...data },
            });
            Object.freeze(struct);
            // ^ Prevent marking as unhydrated or repending
        } else if (!struct.is_hydrated && !struct.is_pending) {
            MOBX.extendObservable(struct, { is_pending: true });
        }
        return struct;
    }

    // -----------

    /* eslint-disable no-unused-vars */
    function throw_error(message) {
        throw new Error(`BULLPEN.Treepen.Store: ${ message }`);
    }
}(
    require('bullpen'),
    require('mobx'),
));
