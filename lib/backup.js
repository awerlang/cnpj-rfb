const assert = require('assert')
const fs = require('fs')
const {registerCallback} = require('./cleanup')

function backup(cnpj, fileType, content) {
    assert(!!content, 'content must not empty')
    fs.writeFile(`./data/${cnpj}.${fileType}.html`, content, registerCallback())
}

module.exports = backup
