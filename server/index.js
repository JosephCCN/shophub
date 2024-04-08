const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const cors = require('cors')

const auth = require('./router/auth.js')
const cart = require('./router/cart.js')
const history = require('./router/history.js')
const miss = require('./router/miss.js')
const noti = require('./router/noti.js')
const product = require('./router/product.js')
const profile = require('./router/profile.js')
const review = require('./router/review.js')
const search = require('./router/search.js')
const seller = require('./router/seller.js')
const user = require('./router/user.js')
const wishlist = require('./router/wishlist.js')

const port = 3030

app.use(cors())
app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

app.use('/', auth);
app.use('/', cart);
app.use('/', history);
app.use('/', miss);
app.use('/', noti);
app.use('/', product);
app.use('/', profile);
app.use('/', review);
app.use('/', search);
app.use('/', seller);
app.use('/', user);
app.use('/', wishlist);

app.get('/', (req, res) => {
    res.send('Deployed');
})

app.listen(port, (err) => {
    console.log('running...')
});