const express = require('express')
const multer = require('multer')
var path = require('path')
const cors = require('cors')
const db = require('./db')
const app = express()
var bodyParser = require('body-parser')
const fs = require('fs')
const { createCipheriv } = require('crypto')
const { resourceLimits } = require('worker_threads')
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
    result = await db.query(`select user_id, is_admin from users where username='${username}'`)
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
    try{
        const fileName = `./img/${id}`;
        const filePaths = [
            `${fileName}.jpg`,
            `${fileName}.png`,
            `${fileName}.jpeg`,
            `${fileName}.gif`,
        ];
        var filename = 0
        for(const filePath of filePaths){
            if(fs.existsSync(filePath)){
                filename = filePath;
            }
        }
        if(filename == 0) throw('Image Not Found!!')
        res.download(filename)
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
})

app.get('/seller_product', async(req, res) => {
    id = req.query.id;
    asc = req.query.asc;
    if(asc == 1) query_msg = `select * from product where seller_id=${id} order by product_id asc`
    else query_msg = `select * from product where seller_id=${id} order by product_id desc`
    try{
        result = await db.query(query_msg);
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

app.get('/profile', async(req, res) =>{
    userid = req.query.userid;
    var result;
    try{
        result = await db.query(`select * from users where user_id = ${userid}`)
        res.json(result.rows)
    }
    catch(err){
        res.json({'err': err});
        return;
    }
})

app.post('/edit_profile', async(req, res) => {
    userid = req.body.userid;
    username = req.body.username;
    password = req.body.password;
    var result;
    try{
        result = await db.query(`update users set (username, password) = ('${username}', '${password}') where user_id = ${userid}`)
        res.json({'success': 1});
    }
    catch(err){
        res.json({'err': err})
        return;
    }
})

app.get('/orderid', async(req, res) => {
    userid = req.query.userid;
    amount = req.query.top;
    var result;
    try{
        result = await db.query(`select distinct on (order_id) order_id from history where buyer_id=${userid} order by order_id, order_date desc limit ${amount}`);
        res.json(result.rows);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }

})

app.get('/order', async(req, res) => {
    orderid = req.query.orderid;
    var result;
    try{
        result = await db.query(`select * from history where order_id=${orderid}`)
        res.json(result.rows);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
})

app.get('/user', async(req, res) => {
    userid = req.query.userid;
    try{
        result = await db.query(`select * from users where user_id=${userid}`)
        res.json(result.rows);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
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

app.get('/all_users', async(req, res) => {
    try {
        result = await db.query(`select * from users`);
    }
    catch(err) {
        res.json({'err':err});
    }
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

app.get('/all_products', async(req, res) => {
    try {
        result = await db.query(`select * from product`);
    }
    catch(err) {
        res.json({'err':err});
    }
})

app.post('/delete_img', async(req, res) => {
    productid = req.body.productid;
    try{
        const fileName = `./img/${productid}`;
        const filePaths = [
            `${fileName}.jpg`,
            `${fileName}.png`,
            `${fileName}.jpeg`,
            `${fileName}.gif`,
        ];
        var filename = 0
        for(const filePath of filePaths){
            if(fs.existsSync(filePath)){
                filename = filePath;
            }
        }
        if(filename == 0) throw('Image Not Found!!')
        fs.unlink(filename, (err) => {
            if(err) throw err;
            console.log(`imaged ${filename} deleted`)
        })
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json({'sucess': 1});
})

app.get('/maxproductid', async(req, res) => {
    try{
        result = await db.query(`select last_value from product_product_id_seq`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
})

app.post('/add_cart', async(req, res) => {
    const productID = req.body.productID;
    const userID = req.body.userID;
    const quantity = req.body.quantity;
    console.log(productID, userID, quantity)
    try{
        const result = await db.query(`select * from cart where product_id=${productID} and user_id=${userID}`);
        if(result.rows.length > 0) {
            res.json({'in_cart': 1});
            return;
        }
    }
    catch(err) {
        res.json({'err':err});
        return;
    }
    try{
        const result = await db.query(`insert into cart (product_id, user_id, quantity) values (${productID}, ${userID}, ${quantity})`);
        res.json({})
        return;
    }
    catch(err) {
        res.json({'err':err});
    }
})

const image_storage = multer.diskStorage({
    destination: './img',
    filename: (req, file, cb) => {
        cb(null, `${req.body.productid}${path.extname(file.originalname)}`);
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
        callback('Wrong File Format')
    }
})
app.post('/add_product', upload.single('image'), async(req, res) => {
    userid = req.body.userid;
    productname = req.body.productname;
    productinfo = req.body.productinfo;
    price = req.body.price;
    quantity = req.body.quantity;
    category = req.body.category;
    try{
        result = await db.query(`insert into product (seller_id, product_name, info, price, quantity, category) values ('${userid}', '${productname}', '${productinfo}', '${price}', '${quantity}', '${category}')`);
        res.json({'success': 1});
    }
    catch(err){
        res.json({'err':err});
        return;
    }
})

app.post('/edit_product', upload.single('image'), async(req, res) => {
    productid = req.body.productid;
    productname = req.body.productname;
    productinfo = req.body.productinfo;
    price = req.body.price;
    quantity = req.body.quantity;
    category = req.body.category;
    try{
        result = await db.query(`update product set (product_name, info, price, quantity, category) = ('${productname}', '${productinfo}', '${price}', '${quantity}', '${category}') where product_id='${productid}'`);
        res.json({'success': 1});
    }
    catch(err){
        res.json({'err': err});
        return;
    }
})

app.get('/delete_product', async(req, res) => {
    productid = req.query.productid;
    try{
        result = await db.query(`delete from product where product_id=${productid}`);
        var filename;
        if(fs.existsSync(`./img/${productid}.png`))
            filename = `./img/${productid}.png`;
        else if(fs.existsSync(`./img/${productid}.jpg`))
            filename = `./img/${productid}.jpg`;
        else if(fs.existsSync(`./img/${productid}.jpeg`))
            filename = `./img/${productid}.jpeg`;
        else if(fs.existsSync(`./img/${productid}.gif`))
            filename = `./img/${productid}.gif`;
        else throw('Image not found!');
        fs.unlink(filename, (err) => {
            if(err) throw err;
            console.log(`image ${filename} deleted`)
        })
        res.json({'success': 1});
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
})

app.get('/review', async(req, res) => {
    productid = req.query.productid;
    userid = req.query.userid;
    try{
        result = await db.query(`select * from review where (product_id, user_id) = (${productid}, ${userid})`)
        if(result.rows.length === 0) res.json({0:{'exist': 0}})
        else{
            result.rows[0]['exist'] = 1
            res.json(result.rows)
        }
    }
    catch(err){
        res.json({'err': err});
        return;
    }
})
app.listen(port, (err) => {
    console.log('running...')
})