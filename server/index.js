const express = require('express')
const multer = require('multer')
const cors = require('cors')
const db = require('./db')
const app = express()
var bodyParser = require('body-parser')
const port = 3030

app.use(cors())
app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Deployed');
})

app.get('/cart', (req, res) => {
    var userid = req.query.userid
    const result = db.query('select * from users')
    res.json(result.rows)
})

app.post('/login', async(req, res) => {
    username = req.body.username;
    pwd = req.body.password;
    console.log(username, pwd);
    var result = await db.query(`select password from users where username='${username}'`)
    if(result.rows.length != 1) {
        res.json({err: 'No Such User'});
        return;
    }
    real_password = result.rows[0]['password'];
    if(pwd != real_password) {
        res.json({err: 'Wrong Password'});
        return;
    }
    result = await db.query(`select user_id from users where username='${username}'`)
    res.json(result.rows[0])
})

app.post('/register', async(req, res) => {
    username = req.body.username;
    pwd = req.body.password;
    console.log(username, pwd);
    var result = await db.query(`select password from users where username='${username}'`);
    if(result.rows.length > 0) {
        res.json({err: 'username exist'});
        return;
    }
    result = await db.query(`insert into users (username, password) values ('${username}', '${pwd}')`);
    if(result.rows[0] == 'INSERT 0 1') {
        res.json({});
        return;
    }
    else {
        res.json({err: result.rows[0]});
        return;
    }
})

app.get('/search', async(req, res) => {
    key = req.query.key;
    const l = key.length;
    var result;
    try{
        if(Number(key)) result = await db.query(`select * from product where product_id=${key}`);
        else result = await db.query(`select * from product where LEFT(product_name, ${l})='${key}'`);
    }
    catch (err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
})

app.get('/product_img', async(req, res) => {
    id = req.query.id;
    res.download(`./img/${id}.png`);
})

app.get('/seller_product', async(req, res) => {
    id = req.query.id;
    try{
        result = await db.query(`select * from product where seller_id=${id}`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
}
)

app.get('/seller_history', async(req, res) => {
    id = req.query.id;
    amount = req.query.top;
    var result;
    try{
        result = await db.query(`select * from history where seller_id=${id} order by order_date desc limit ${amount}`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
})

app.get('/buyer_history', async(req, res) => {
    id = req.query.id;
    amount = req.query.top;
    var result;
    try{
        result = await db.query(`select * from history where buyer=${id} order by order_date desc limit ${amount}`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);

})

app.get('/username', async(req, res) => {
    id = req.query.id;
    try{
        result = await db.query(`select username from users where user_id=${id}`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
})

app.get('/product_name', async(req, res) => {
    id = req.query.id;
    try{
        result = await db.query(`select product_name from product where product_id=${id}`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
})

app.get('/product', async(req, res) => {
    productid = req.query.productid;
    try{
        result = await db.query(`select * from product where product_id=${productid}`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
})

const image_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'img');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: image_storage,
    limits:{fileSize:'1000000'},
    fileFilter:(req, file, callback)=>{
        const fileType = /jpeg|jpg|png|gif/
        const mimeType = fileType.test(file.mimetype)
        const extname = fileType.test(path.extname(file.originalname))
        if(mimeType && extname){
            return callback(null, true)
        }
        callback('Give proper file format to upload')
    }
}).single('image')

app.post('/add_product', async(req, res) => {
    userid = req.body.userid;
    productname = req.body.productname;
    productinfo = req.body.productinfo;
    price = req.body.price;
    quantity = req.body.quantity;
    category = req.body.category;
    result = await db.query(`insert into product (seller_id, product_name, info, price, quantity, category) values ('${userid}', '${productname}', '${productinfo}', '${price}', '${quantity}', '${category}')`);
    // upload.single(image);
    if(result.rows[0] == 'INSERT 0 1') {
        res.json({});
        return;
    }
    else {
        res.json({err: result.rows[0]});
        return;
    }
})

app.post('/edit_product', async(req, res) => {
    productid = req.body.productid;
    productname = req.body.productname;
    productinfo = req.body.productinfo;
    price = req.body.price;
    quantity = req.body.quantity;
    category = req.body.category;
    console.log(productid);
    result = await db.query(`update product set (product_name, info, price, quantity, category) = ('${productname}', '${productinfo}', '${price}', '${quantity}', '${category}') where product_id='${productid}'`);
    // upload.single(image);
    if(result.rows[0] == 'UPDATE 1') {
        res.json({});
        return;
    }
    else {
        res.json({err: result.rows[0]});
        return;
    }
})

app.get('/delete_product', async(req, res) => {
    productid = req.query.productid;
    try{
        result = await db.query(`delete from product where product_id=${productid}`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
})
app.listen(port, (err) => {
    console.log('running...')
})