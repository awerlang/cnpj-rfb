const lowdb = require('lowdb')

const db = lowdb('./data/db.json')

function initDatabase() {

}

function exists(cnpj) {
    const entry = db.get(cnpj)
        .value()
    return entry && !entry.$error 
}

function found(cnpj, data) {
    db.set(cnpj, data)
        .value()
}

function failed(cnpj, data) {
    db.set(cnpj, { $error: true, $message: data })
        .value()
}

initDatabase()

module.exports = {
    exists,
    found,
    failed,
}
