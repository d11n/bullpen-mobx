// eslint-disable-next-line max-params
(function main(BULLPEN, MOBX) {
    class Store extends BULLPEN.Treepen.Store {
        constructor(...args) {
            return super(...args)
        }
    }
    Object.assign(Store.prototype, {
        initialize_struct,
        perform_default_fetch,
        perform_key_fetch,
    })
    return module.exports = Object.freeze(Store)

    ///////////

    function initialize_struct({ store, tree }) {
        const struct = MOBX.observable(Object.defineProperties({}, {
            tree: { value: { ...tree }, enumerable: true },
            is_pending: { value: false, enumerable: true, writable: true },
            is_hydrated: { value: false, enumerable: true, writable: true },
        }))
        Object.defineProperties(store, {
            is_pending: { value: () => struct.is_pending },
        })
        return struct
    }

    function perform_default_fetch({ struct, data }) {
        ensure_store_is_hydrated({ struct, data })
        return struct.tree
    }

    function perform_key_fetch({ struct, op, data }) {
        ensure_store_is_hydrated({ struct, data })
        const { key } = op.params
        // JSON Path?
        return struct.tree[key]
    }

    function ensure_store_is_hydrated({ struct, data }) {
        // Support MobX 3-5        4-5     3
        const method = MOBX.set ? 'set' : 'extendObservable'
        if (data && Object.keys(data).length > 0) {
            if (MOBX.set) {
                // MOBX 4-5
                MOBX.set(struct, {
                    is_hydrated: true,
                    is_pending: false,
                    tree: data,
                })
            } else {
                // MOBX 3
                const emptied_tree = {}
                for (const key of Object.keys(struct.tree)) {
                    emptied_tree[key] = undefined
                }
                MOBX.extendObservable(struct, {
                    is_hydrated: true,
                    is_pending: false,
                    tree: { ...emptied_tree, ...data },
                })
            }
            Object.freeze(struct)
            // ^ Prevent marking as unhydrated or repending
        } else if (!struct.is_hydrated && !struct.is_pending) {
            MOBX[method](struct, { is_pending: true })
        }
        return struct
    }

    ///////////

    /* eslint-disable no-unused-vars */
    function throw_error(message) {
        throw new Error(`BULLPEN.Treepen.Store: ${ message }`)
    }
}(
    require('bullpen'),
    require('mobx'),
))
