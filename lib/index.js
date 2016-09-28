const fetchCnpj = require('./fetcher')
const processCnpj = require('./processor')
const backup = require('./backup')
const exists = require('./database').exists
const found = require('./database').found
const failed = require('./database').failed
const cleanup = require('./cleanup').cleanup
const registerCallback = require('./cleanup').registerCallback

module.exports = {
    fetchCnpj,
    processCnpj,
    backup,
    exists,
    found,
    failed,
    cleanup,
    registerCallback,
}
