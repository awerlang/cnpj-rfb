let counter = 0;
let cleanupFn

function cleanup(callback) {
    if (counter === 0) {
        return callback()
    }

    cleanupFn = callback
}

function registerCallback() {
    counter++
    return function (err) {
        counter--
        if (err) throw err

        if (counter === 0 && cleanupFn) {
            cleanupFn()
        }
    }
}

module.exports = {
    cleanup,
    registerCallback,
}
