const {cleanup} = require('./lib/index')

process.on('uncaughtException', function (err) {
    console.log(err);
    cleanup(() => {
        process.exit(1)
    })
})

process.on('unhandledRejection', function(reason, p){
    console.log("Unhandled Rejection, reason: ", reason);
    cleanup(() => {
        process.exit(1)
    })
});

const readline = require('readline')
const cnpj = require('./lib/index')

const cookies = process.argv[2]
if (!cookies) {
    console.log('Informe session-token')
    process.exit(1)
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
})

let nextTask = Promise.resolve()

const processed = {}
rl.on('line', function (line) {
    line = line.replace(/[ \.\-/]/g, '')
    if (!line) {
        rl.close()
        return
    }
    if (line.length === 11) {
        return
    }
    if (processed[line]) {
        return
    }
    processed[line] = true
    if (cnpj.exists(line)) {
        return
    }

    const awaiter = nextTask
    nextTask = new Promise((resolve, reject) => {
        awaiter.then(() => {
            fetchOne(line).then(resolve, reject)
        })
    })
})

function fetchOne(line) {
    console.log('Processing: ', line, 'fetching...')

    return cnpj.fetchCnpj(line, cookies)
        .then(response => {
            const {qsa} = cnpj.processCnpj(response)
            const {info} = response
            cnpj.found(line, Object.assign(info, { qsa }))
        })
        .catch(err => {
            cnpj.failed(line, err)
            console.error('  Error:', err.code, err.message)
            if (err.unrecoverable || err.code === 'ECONNRESET') {
                throw err
            }
        })
}