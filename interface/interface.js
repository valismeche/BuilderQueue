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
        ui = new Interface('BuilderQueue', {
            activeTab: 'info',
            template: '__builder_html_window',
            replaces: {
                locale: Locale,
                version: '__builder_version'
            },
            css: '__builder_css_style'
        })

        opener = new FrontButton('Builder', {
            classHover: false,
            classBlur: false
        })

        opener.click(function () {
            ui.openWindow()
        })

        return ui
    }

    Builder.interface = function () {
        Builder.interface = BuilderInterface()
    }
})
