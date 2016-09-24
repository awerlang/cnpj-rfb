const request = require('request')

const urlCnpj = 'http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/Cnpjreva_Vstatus.asp?origem=comprovante'
const urlQsa = 'http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/Cnpjreva_qsa.asp'

function fetchCnpj(cnpj, authCookie) {
    const jar = request.jar()
    const cookie = request.cookie(authCookie)
    jar.setCookie(cookie, urlCnpj)

    return new Promise((resolve, reject) => {
        request({ url: urlCnpj, jar: jar, qs: { cnpj: cnpj } }, (err, cnpjResponse) => {
            if (err) return reject(err)

            if (cnpjResponse.body.includes('id="imgCaptcha"')) {
                throw new Error('Session expired');
            }
            if (!cnpjResponse.body.includes('Consulta QSA')) {
                return resolve({
                    source: cnpj,
                    cnpj: cnpjResponse,
                    qsa: null,
                })
            }

            request({ url: urlQsa, jar: jar }, (err, qsaResponse) => {
                if (err) return reject(err)

                resolve({
                    source: cnpj,
                    cnpj: cnpjResponse,
                    qsa: qsaResponse,
                })
            })
        })
    })
}

module.exports = fetchCnpj
