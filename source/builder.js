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
     * Indica se o BuilderQueue já foi inicializado.
     *
     * @type {Boolean}
     */
    var initialized = false

    /**
     * Métodos e propriedades publicas do BuilderQueue.
     *
     * @type {Object}
     */
    var Builder = {}

    /**
     * Versão atual do BuilderQueue
     *
     * @type {String}
     */
    Builder.version = '__builder_version'

    /**
     * Atualiza as configurações com os dados passados pelo usuário.
     *
     * @param {Object} changes - Novas configurações.
     */
    Builder.updateSettings = function (changes) {
        // TODO
        // analisar a sequencia para checar conflitos de leveis.

        for (var key in changes) {
            var newValue = changes[key]

            if (newValue === Builder.settings[key]) {
                continue
            }

            Builder.settings[key] = newValue
        }

        Lockr.set('builder-settings', Builder.settings)

        return true
    }

    /**
     * Inicializa o BuilderQueue.
     */
    Builder.init = function () {
        Locale.create('builder', __builder_locale, 'en')

        initialized = true

        /**
         * Configurações salvas localmente
         *
         * @type {Object}
         */
        var localSettings = Lockr.get('builder-settings', {}, true)

        Builder.settingsMap = {
            groupVillages: {
                default: '',
                inputType: 'select'
            },
            sequence: {
                default: [
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
                ],
                inputType: 'sequence'
            }
        }

        /**
         * Configurações do jogador + configurações padrões
         *
         * @type {Object}
         */
        Builder.settings = {}

        for (var key in Builder.settingsMap) {
            var defaultValue = Builder.settingsMap[key].default

            Builder.settings[key] = localSettings.hasOwnProperty(key)
                ? localSettings[key]
                : defaultValue
        }

        rootScope.$on(eventTypeProvider.GROUPS_UPDATED, function () {
            eventQueue.trigger('Builder/groupsChanged')
        })
    }

    /**
     * Retorna se o BuilderQueue já foi inicializado.
     *
     * @return {Boolean}
     */
    Builder.isInitialized = function () {
        return initialized
    }

    return Builder
})
