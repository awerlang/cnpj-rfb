const fetchCnpj = require('./fetcher')
const processCnpj = require('./processor')
const backup = require('./backup')
const exists = require('./database').exists
const found = require('./database').found
const failed = require('./database').failed

module.exports = {
    fetchCnpj,
    processCnpj,
    backup,
    exists,
    found,
    failed,
}
