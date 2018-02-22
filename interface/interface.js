define('TWOverflow/Builder/interface', [
    'TWOverflow/Builder',
    'TWOverflow/locale',
    'TWOverflow/Interface',
    'TWOverflow/FrontButton',
    'TWOverflow/eventQueue',
    'TWOverflow/utils',
    'ejs'
], function (
    Builder,
    Locale,
    Interface,
    FrontButton,
    eventQueue,
    utils,
    ejs
) {
    // Controlador de interface
    var ui
    // Controlador do botão para abrir a janela da interface
    var opener

    var groups

    var $window
    var $sequence
    var $sequenceBody
    var $groupVillages
    var $settings
    var $save

    var disabled

    var buildingOrder = {
        headquarter: 0,
        timber_camp: 1,
        clay_pit: 2,
        iron_mine: 3,
        farm: 4,
        warehouse: 5,
        chapel: 6,
        church: 7,
        rally_point: 8,
        barracks: 9,
        statue: 10,
        hospital: 11,
        wall: 12,
        market: 13,
        tavern: 14,
        academy: 15,
        preceptory: 16
    }

    var updateGroupVillages = function () {
        var $selectedOption = $groupVillages.find('.custom-select-handler').html('')
        var $data = $groupVillages.find('.custom-select-data').html('')

        appendDisabledOption($data, '0')

        for (var id in groups) {
            var name = groups[id].name
            var selected = Builder.settings.groupVillages == id

            if (Builder.settings.groupVillages === '') {
                $selectedOption.html(disabled)
                $groupVillages[0].dataset.name = disabled
                $groupVillages[0].dataset.value = ''
            } else if (Builder.settings.groupVillages == id) {
                $selectedOption.html(name)
                $groupVillages[0].dataset.name = name
                $groupVillages[0].dataset.value = id
            }

            appendSelectData($data, {
                name: name,
                value: id,
                icon: groups[id].icon
            })

            $groupVillages.append($data)
        }

        if (!Builder.settings.groupVillages) {
            $selectedOption.html(disabled)
        }

    }

    /**
     * Gera uma opção "desativada" padrão em um custom-select
     *
     * @param  {jqLite} $data - Elemento que armazenada o <span> com dataset.
     * @param {String=} _disabledValue - Valor da opção "desativada".
     */
    var appendDisabledOption = function ($data, _disabledValue) {
        var dataElem = document.createElement('span')
        dataElem.dataset.name = disabled
        dataElem.dataset.value = _disabledValue || ''

        $data.append(dataElem)
    }

    /**
     * Popula o dataset um elemento <span>
     *
     * @param  {jqLite} $data - Elemento que armazenada o <span> com dataset.
     * @param  {[type]} data - Dados a serem adicionados no dataset.
     */
    var appendSelectData = function ($data, data) {
        var dataElem = document.createElement('span')

        for (var key in data) {
            dataElem.dataset[key] = data[key]
        }

        $data.append(dataElem)
    }

    /**
     * Loop em todas configurações do BuilderQueue
     *
     * @param {Function} callback
     */
    var eachSetting = function (callback) {
        $window.find('[data-setting]').forEach(function ($input) {
            var settingId = $input.dataset.setting

            callback($input, settingId)
        })

        callback($sequence, 'sequence')
    }

    var saveSettings = function () {
        var newSettings = {}

        eachSetting(function ($input, settingId) {
            var inputType = Builder.settingsMap[settingId].inputType

            switch (inputType) {
            case 'text':
                newSettings[settingId] = $input.type === 'number'
                    ? parseInt($input.value, 10)
                    : $input.value

                break
            case 'select':
                newSettings[settingId] = $input.dataset.value

                break
            case 'checkbox':
                newSettings[settingId] = $input.checked

                break
            case 'sequence':
                var newSequence = []
                var $levels = $input.find('td.level')

                $levels.forEach(function ($level) {
                    var building = $level.dataset.building
                    var level = parseInt($level.innerHTML, 10)

                    newSequence.push([building, level])
                })

                newSettings[settingId] = newSequence

                break
            }
        })

        if (Builder.updateSettings(newSettings)) {
            utils.emitNotif('success', Locale('builder', 'settings.saved'))

            return true
        }

        return false
    }

    /**
     * Insere as configurações na interface.
     */
    var populateSettings = function () {
        eachSetting(function ($input, settingId) {
            var inputType = Builder.settingsMap[settingId].inputType

            switch (inputType) {
            case 'text':
                $input.value = Builder.settings[settingId]

                break
            case 'select':
                $input.dataset.value = Builder.settings[settingId]

                break
            case 'checkbox':
                if (Builder.settings[settingId]) {
                    $input.checked = true
                    $input.parentElement.classList.add('icon-26x26-checkbox-checked')
                }

                break
            case 'sequence':
                appendSequence()

                break
            }
        })
    }

    var appendSequence = function () {
        Builder.settings.sequence.forEach(function (item) {
            var building = item[0]
            var buildingLevel = item[1]
            var buildingIndex = buildingOrder[building]
            var $row = document.createElement('tr')
            var $cell

            for (var cellIndex = 0; cellIndex < 17; cellIndex++) {
                $cell = document.createElement('td')

                if (buildingIndex === cellIndex) {
                    $cell.className = 'level'
                    $cell.dataset.building = building
                    $cell.innerHTML = buildingLevel
                }

                $row.appendChild($cell)
            }

            $sequenceBody.append($row)
        })
    }

    function BuilderInterface () {
        groups = modelDataService.getGroupList().getGroups()
        disabled = Locale('builder', 'general.disabled')

        ui = new Interface('BuilderQueue', {
            activeTab: 'info',
            template: '__builder_html_window',
            replaces: {
                locale: Locale,
                version: '__builder_version',
                buildingOrder: buildingOrder
            },
            css: '__builder_css_style'
        })

        opener = new FrontButton('Build', {
            classHover: false,
            classBlur: false
        })

        opener.click(function () {
            ui.openWindow()
        })

        $window = $(ui.$window)
        $sequence = $window.find('.sequence')
        $sequenceBody = $sequence.find('tbody')
        $groupVillages = $window.find('.groupVillages')
        $settings = $window.find('.settings')
        $save = $window.find('.save')

        populateSettings()
        updateGroupVillages()

        $save.on('click', function (event) {
            saveSettings()
        })

        eventQueue.bind('Builder/groupsChanged', function () {
            updateGroupVillages()
        })

        return ui
    }

    Builder.interface = function () {
        Builder.interface = BuilderInterface()
    }
})
