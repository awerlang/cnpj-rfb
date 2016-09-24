const cheerio = require('cheerio')

function processCnpj(response) {
    if (!response.qsa) {
        return {
            qsa: null
        }
    }
    const $ = cheerio.load(response.qsa.body)
    const rows = $('table table table td:first-child table tr td:nth-child(2)')

    const qsa = []
    for (let i = 0; i < rows.length; i += 2) {
        const nome = rows.eq(i).text().trim()
        const qualificacao = rows.eq(i + 1).text().trim()
        qsa.push({
            nome,
            qualificacao,
        })
    }

    return {
        qsa: qsa
    }
}

module.exports = processCnpj
