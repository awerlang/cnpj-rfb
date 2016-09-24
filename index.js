process.on('uncaughtException', function (err) {
  console.log(err);
  process.exit(1)
})

process.on('unhandledRejection', function(reason, p){
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
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

rl.on('line', function (line) {
    line = line.replace(/[ \.\-/]/g, '')
    if (!line) {
        rl.close()
        return
    }
    if (cnpj.exists(line)) {
        console.log('Processing: ', line, 'cached, skipping...')
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
            cnpj.backup(line, 'cnpj', response.cnpj.body)
            if (response.qsa) {
                cnpj.backup(line, 'qsa', response.qsa.body)
            }
            
            const results = cnpj.processCnpj(response)
            cnpj.found(line, results)
        })
        .catch(err => {
            cnpj.failed(line, err)
            console.error(err)
            throw err
        })
}