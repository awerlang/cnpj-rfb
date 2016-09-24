const fs = require('fs')

function backup(cnpj, fileType, content) {
    fs.writeFile(`./data/${cnpj}.${fileType}.html`, content)
}

module.exports = backup
