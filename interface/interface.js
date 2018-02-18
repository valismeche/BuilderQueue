define('TWOverflow/Builder/interface', [
    'TWOverflow/Builder',
    'TWOverflow/locale',
    'TWOverflow/Interface',
    'TWOverflow/FrontButton',
    'ejs'
], function (
    Builder,
    Locale,
    Interface,
    FrontButton,
    ejs
) {
    // Controlador de interface
    var ui
    // Controlador do botão para abrir a janela da interface
    var opener

    function BuilderInterface () {
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

        var $window = $(ui.$window)
        var $sequence = $window.find('.sequence')
        var $sequenceBody = $sequence.find('tbody')

        Builder.buildingSequence.forEach(function (item) {
            var $row = document.createElement('tr')
            var $cell
            var buildingIndex = buildingOrder[item[0]]

            for (var cellIndex = 0; cellIndex < 17; cellIndex++) {
                $cell = document.createElement('td')

                if (buildingIndex === cellIndex) {
                    $cell.className = 'level'
                    $cell.innerHTML = item[1]
                }

                $row.appendChild($cell)
            }

            $sequenceBody.append($row)
        })

        return ui
    }

    Builder.interface = function () {
        Builder.interface = BuilderInterface()
    }
})
