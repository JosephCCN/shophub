const express = require('express')
const db = require('./db')
const app = express()
const port = 3030


app.get('/', (req, res) => {
    res.send('Deployed');
})

app.get('/cart', (req, res) => {
    var userid = req.query.userid
    const result = db.query('select * from users')
    res.json(result.rows)
})

app.listen(port, (err) => {
    console.log('running...')
})