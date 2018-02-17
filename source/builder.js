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

        Builder.buildingSequence = [
            ['timber_camp', 2],
            ['clay_pit', 2],
            ['iron_mine', 2],
            ['farm', 2],
            ['warehouse', 2],
            ['timber_camp', 3],
            ['clay_pit', 3],
            ['iron_mine', 3],
            ['warehouse', 3],
            ['timber_camp', 4],
            ['clay_pit', 4],
            ['iron_mine', 4]
        ]
    }

    return Builder
})
