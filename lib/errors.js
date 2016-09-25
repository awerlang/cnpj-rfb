function UnrecoverableError(message) {
    const error = new Error(message)
    error.unrecoverable = true;
    return error;
}

module.exports = {
    UnrecoverableError
}
