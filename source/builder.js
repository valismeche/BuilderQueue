define('TWOverflow/Builder', [
    'TWOverflow/locale',
    'TWOverflow/utils',
    'TWOverflow/eventQueue',
    'Lockr'
], function (
    Locale,
    utils,
    eventQueue,
    Lockr
) {
    /**
     * Métodos e propriedades publicas do BuilderQueue.
     *
     * @type {Object}
     */
    var Builder = {}

    /**
     * Indica se o BuilderQueue já foi inicializado.
     *
     * @type {Boolean}
     */
    Builder.initialized = false

    /**
     * Versão atual do BuilderQueue
     *
     * @type {String}
     */
    Builder.version = '__builder_version'

    /**
     * Inicializa o BuilderQueue.
     */
    Builder.init = function () {
        Locale.create('builder', __builder_locale, 'en')

        Builder.initialized = true

        console.log('Builder initialized!')
    }

    return Builder
})
