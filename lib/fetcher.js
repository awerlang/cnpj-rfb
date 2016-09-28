const request = require('request')
const iconv = require('iconv-lite')
const {UnrecoverableError} = require('./errors')
const backup = require('./backup')

const urlReceitaWs = 'http://receitaws.com.br/v1/cnpj/'
const urlCnpj = 'http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/Cnpjreva_Vstatus.asp?origem=comprovante'
const urlQsa = 'http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/Cnpjreva_qsa.asp'

const baseRequest = request.defaults({
    jar: true,
    forever: true,
    gzip: true,
})

function fetchCnpj(cnpj, authCookie) {
    return fetchReceitaWs(cnpj)
        .then(info => {
            const response = {
                source: cnpj,
                info: info,
            }
            if (info.tipo === 'FILIAL') {
                // TODO: fetch data from MATRIZ (ends with /0001-XX)
                return response
            }
            if (info.situacao === 'BAIXADA') {
                return response
            }

            return fetchRfb(cnpj, authCookie)
                .then(rfb => {
                    return Object.assign(response, rfb)
                })
        })
}

function fetchReceitaWs(cnpj) {
    return new Promise((resolve, reject) => {
        baseRequest({ url: urlReceitaWs + cnpj }, (err, wsResponse) => {
            if (err) return reject(err)
            if (wsResponse.statusCode !== 200) return reject(wsResponse.body || wsResponse.statusMessage)

            const json = JSON.parse(wsResponse.body)
            return resolve(json)
        })
    })
}

function fetchRfb(cnpj, authCookie) {
    return new Promise((resolve, reject) => {
        const jar = request.jar()
        const cookie = request.cookie(authCookie)
        jar.setCookie(cookie, urlCnpj)

        baseRequest({ url: urlCnpj, jar: jar, qs: { cnpj: cnpj }, encoding: null }, (err, cnpjResponse) => {
            if (err) return reject(err)

            const cnpjContent = iconv.decode(cnpjResponse.body, 'iso-8859-1')
            backup(cnpj, 'cnpj', cnpjContent)
            if (cnpjContent.includes('id="imgCaptcha"')) {
                throw new UnrecoverableError('Session expired')
            }
            if (!cnpjContent.includes('Consulta QSA')) {
                return resolve({
                    cnpj: cnpjContent,
                    qsa: null,
                })
            }

            baseRequest({ url: urlQsa, jar: jar, encoding: null }, (err, qsaResponse) => {
                if (err) return reject(err)

                const qsaContent = iconv.decode(qsaResponse.body, 'iso-8859-1')
                backup(cnpj, 'qsa', qsaContent)
                resolve({
                    cnpj: cnpjContent,
                    qsa: qsaContent,
                })
            })
        })
    })
}

module.exports = fetchCnpj
