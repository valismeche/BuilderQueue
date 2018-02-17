require([
    'TWOverflow/ready',
    'TWOverflow/Builder',
    'TWOverflow/Builder/interface'
], function (
    ready,
    Builder
) {
    if (Builder.initialized) {
        return false
    }

    ready(function () {
        Builder.init()
        Builder.interface()
    })
})
