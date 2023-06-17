const sqlite3 = require('sqlite3')
const fs = require('fs')
const https = require('https')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const app = express()
const privateKeyFile = ""
const certFile = ""
const port = 3000

const db = new sqlite3.Database('data.db')

function saveScore(gameId, categoryId, playerId, score) {
    return new Promise(resolve => {
        db.run("INSERT INTO Scores VALUES (?, ?, ?, ?, ?)", [gameId, categoryId, playerId, score, new Date().toISOString()], err => {
            if (err) {
                console.log("Insert error", err)
            }
            resolve(err)
        })
    })
}
function fetchRandomEntry() {
    return new Promise(resolve => {
        // db.get("select p.code from 'packagings-with-weights' as p left join materials on material = name left join apicache on apicache.code = p.code where name is not null and image_url is not null order by random() limit 1", (err, data) => {
        db.get("select code from 'packagings-with-weights' left join materials on material = name where name is not null order by random() limit 1", (err, data) => {
            resolve(data)
        })
    })
}

function fetchProductByCode(code) {
    return new Promise(resolve => {
        db.get("select code, max(sum(weight_specified*KgCo2ePerKg), sum(weight_measured*KgCo2ePerKg)) as gCO2e, group_concat(material) as materials from 'packagings-with-weights' left join materials on material = name where code = ?", code, (err, data) => {
            resolve(data)
        })
    })
}

function fetchAdditionalProductInfoByCode(code) {
    return new Promise(resolve => {
        db.get("select code, image_url, product_name from apicache where code = ?", [code], (err, data) => {
            if(data) {
                resolve(data)
            } else {
                fetch(`https://fr.openfoodfacts.org/api/v2/product/${code}&fields=image_url,product_name,abbreviated_product_name`)
                .then(res => res.json())
                .then(res => {
                    const product_name = res.product.product_name || res.product.abbreviated_product_name
                    db.run("INSERT INTO apicache VALUES (?, ?, ?)", [code, res.product.image_url, product_name], err => {
                        if (err) {
                            console.log("Insert error", err)
                        }
                    })
                    resolve({
                        code: code,
                        image_url: res.product.image_url,
                        product_name: product_name
                    })
                })
            }
        })
    })
}
async function fetchRandomProductData() {
    const code = await fetchRandomEntry()
    let product = await fetchProductByCode(code.code)
    const additionalData = await fetchAdditionalProductInfoByCode(code.code)
    product.image_url = additionalData.image_url
    product.product_name = additionalData.product_name
    return product
}
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('frontend'))

app.post('/api/storeScore', async (req, res) => {
    if (!req.body.gameId || !req.body.playerId || !req.body.categoryId || !req.body.score) {
        return res.json({
            err: "Missing at least one body parameter"
        })
    }
    let err = await saveScore(req.body.gameId, req.body.categoryId, req.body.playerId, req.body.score)
    res.json({
        err: err
    })
})

app.get('/api/fetchTwo', async (req, res) => {
    const product1 = await fetchRandomProductData()
    const product2 = await fetchRandomProductData()
    res.json({
        product1: product1,
        product2: product2
    })
})

if (privateKeyFile) {
    const privateKey = fs.readFileSync(privateKeyFile)
    const certificate = fs.readFileSync(certFile)
    const credentials = {key: privateKey, cert: certificate}
    const server = https.createServer(credentials, app)
    server.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
} else {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`)
    })
}

