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
        if(Number(key)) result = await db.query(`select * from product where (product_id, is_deleted)=(${key}, false)`);
        else result = await db.query(`select * from product where (LEFT(product_name, ${l}), is_deleted)=('${key}', false)`);
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
    if(asc == 1) query_msg = `select * from product where (seller_id, is_deleted)=(${id}, false) order by product_id asc`
    else query_msg = `select * from product where (seller_id, is_deleted)=(${id}, false) order by product_id desc`
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
    userid = req.query.userid;
    amount = req.query.top;
    var result;
    try{
        result = await db.query(`select history.* from history join product on history.product_id = product.product_id where (history.seller_id, product.is_deleted) = (${userid}, false) order by history.order_date desc limit ${amount}`);
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
        result = await db.query(`update users set (username, password) = ("${username}", "${password}") where user_id = ${userid}`)
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

app.get('/bought', async(req, res) => {
    const userID = req.query.buyer_id;
    const productID = req.query.product_id;
    var result;
    try{
        result = await db.query(`select * from history where buyer_id=${userID} and product_id=${productID}`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    if(result.rows == []) res.json({'bought': false});
    else res.json({'bought': true});
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
    productid = req.query.productid;
    try{
        result = await db.query(`select product_name from product where (product_id, is_deleted) = (${productid}, false)`);
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
        result = await db.query(`select * from product where product_id=${productid} and is_deleted='f'`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    if(result.rows == []) {
        res.json({'empty': 1})
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

app.get('/cart', async(req, res) => {
    const userid = req.query.id;
   try{
    const result = await db.query(`select cart.product_id, cart.user_id, cart.quantity from cart inner join product on cart.product_id=product.product_id where product.is_deleted='f' and cart.user_id=${userid}`);
    res.json(result.rows);
   }
   catch(err) {
    res.json({'err': err})
   }
})

app.post('/add_cart', async(req, res) => {
    const productID = req.body.productID;
    const userID = req.body.userID;
    const quantity = req.body.quantity;
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

app.post('/add_to_wishlist', async(req, res) => {
    const productid = req.body.productid;
    const userid = req.body.userid;
    try{
        const result = await db.query(`select * from wishlist where product_id=${productid} and user_id=${userid}`);
        if(result.rows.length > 0) {
            res.json({'in_wishlist': 1});
            return;
        }
    }
    catch(err) {
        res.json({'err':err});
        return;
    }
    try{
        const result = await db.query(`insert into wishlist (product_id, user_id) values (${productid}, ${userid})`);
        res.json({})
        return;
    }
    catch(err) {
        res.json({'err':err});
    }
})

app.get('/wishlist', async(req, res) => {
    const userid = req.query.userid;
    try{
        const result = await db.query(`select wishlist.product_id from wishlist join product on product.product_id = wishlist.product_id where (wishlist.user_id, product.is_deleted) = (${userid}, false)`)
        res.json(result.rows)
        return;
    }
    catch(err) {
        res.json({'err':err})
    }
})

app.post('/remove_from_wishlist', async(req, res) => {
    const userid = req.body.userid;
    const productid = req.body.productid;
    try{
        const result = await db.query(`delete from wishlist where (user_id, product_id)=(${userid}, ${productid})`)
        res.json({})
    }
    catch(err){
        res.json({'err':err})
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
        result = await db.query(`insert into product (seller_id, product_name, info, price, quantity, category) values ("${userid}", "${productname}", "${productinfo}", "${price}", "${quantity}", "${category}")`);
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
        result = await db.query(`update product set (product_name, info, price, quantity, category) = ("${productname}", "${productinfo}", "${price}", "${quantity}", "${category}") where product_id="${productid}"`);
        res.json({'success': 1});
    }
    catch(err){
        res.json({'err': err});
        return;
    }
})

app.post('/delete_product', async(req, res) => {
    productid = req.body.productid;
    try{
        result = await db.query(`update product set is_deleted = true where product_id=${productid}`);
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
app.post('/edit_cart_quantity', async(req, res) => {
    const quantity = req.body.quantity;
    const userID = req.body.userID;
    const productID = req.body.productID;
    try {
        const result = await db.query(`update cart set quantity=${quantity} where user_id=${userID} and product_id=${productID}`)
        res.json({'success': 1})
    }
    catch(err) {
        res.json({'err':err})
    }
})

app.post('/delete_cart', async(req, res) => {
    const userID = req.body.userID;
    const productID = req.body.productID;
    try {
        const result = await db.query(`delete from cart where user_id=${userID} and product_id=${productID}`)
        res.json({'success': 1})
    }
    catch(err) {
        res.json({'err':err})
    }
})

app.get('/product_review', async(req, res) => {
    const productID = req.query.product_id;
    try {
        const result = await db.query(`select * from review where product_id=${productID}`)
        res.json(result.rows)
    }
    catch(err) {
        res.json({'err':err})
    }
})

app.post('/review', async(req, res) => {
    const productID = req.body.product_id;
    const userID = req.body.user_id;
    const context = req.body.context.replace('\'', '\'\'');
    const rating = req.body.rating
    try {
        const result = await db.query(`select * from review where product_id=${productID} and user_id=${userID}`);
        if(result.rows == []) await db.query(`insert into review (product_id, user_id, context, rating) values (${productID}, ${userID}, "${context}", ${rating})`)
        else await db.query(`update review set (product_id, user_id, context, rating) = (${productID}, ${userID}, "${context}", ${rating}) where product_id=${productID} and user_id=${userID}`);
    }
    catch(err) {
        res.json({'err':err});
        return;
    }
    res.json({'success': 1});
})

app.get('/recommendation', async(req, res) =>{
    const limit = req.query.limit;
    const userid = req.query.userid;

    const shuffle = (item) => {
        for(var i=0;i<Math.sqrt(item.length);i++) {
            const j = Math.floor(Math.random() * (i + 1));
            [item[i], item[j]] = [item[j], item[i]];
        }
        return item;
    }

    const unqiue = (list) => {
        list = Array.from(new Set(list.map(s => s.product_id)))
        .map(product_id => {
            return {
                product_id: product_id,
                seller_id: list.find(s => s.product_id === product_id).seller_id,
                product_name: list.find(s => s.product_id === product_id).product_name,
                info: list.find(s => s.product_id === product_id).info,
                price: list.find(s => s.product_id === product_id).price,
                quantity: list.find(s => s.product_id === product_id).quantity,
                category: list.find(s => s.product_id === product_id).category,
                is_deleted: list.find(s => s.product_id === product_id).is_deleted
            }
        })
        return list;
    }

    try {
        const result = await db.query(`select product_id, avg(rating) from review group by product_id order by avg desc limit 5`)
        const result2 = await db.query(`select product.category, count(product.category) from product inner join history on product.product_id=history.product_id where history.buyer_id=${userid} group by product.category order by count desc limit 2`)
        var list = []
        console.log(result.rows, result2.rows)
        for(var i=0;i<result.rows.length;i++) {
            const r = await db.query(`select * from product where product_id=${result.rows[i]['product_id']} and is_deleted='f'`)
            if(r.rows.length > 0) list.push(r.rows[0]);
        }
        for(var i=0;i<result2.rows.length;i++) {
            const r = await db.query(`select * from product where category='${result2.rows[i]['category']}' and is_deleted='f'`)
            if(r.rows.length > 0) list.push(r.rows[0]);
        }
        list = unqiue(list)
        res.json(shuffle(list).slice(0, limit))
    }
    catch(err) {
        res.json({'err':err});
        return;
    }
})

app.get('/pay', async(req, res) => {
    const userid = req.query.userid;
    try {
        var result = await db.query(`select * from cart where user_id=${userid}`);
        const order_id = await db.query(`select nextval('history_order_id')`);
        var not_enough = []
        for(var i=0;i<result.rows.length;i++) {
            const cur = result.rows[i];
            const r2 = await db.query(`select * from product where product_id=${cur['product_id']} and is_deleted='f'`);
            if(r2.rows.length == 0) continue;
            if(r2.rows[0]['quantity'] < cur['quantity']) {
                not_enough.push(cur['product_id'])
                continue;
            }
            await db.query(`insert into history values (${order_id.rows[0]['nextval']}, ${userid}, ${r2.rows[0]['seller_id']}, ${cur['product_id']}, current_timestamp, ${cur['quantity']}, ${r2.rows[0]['price']})`);
            await db.query(`update product set quantity=${r2.rows[0]['quantity'] - cur['quantity']} where product_id=${cur['product_id']}`);
            await db.query(`delete from cart where user_id=${userid} and product_id=${cur['product_id']}`);
        }
        if(not_enough.length > 0) {
            res.json({'not_enough': not_enough});
            return;
        }
        res.json({'success': 1});
    }
    catch(err) {
        res.json({'err': err})
    }
})

app.listen(port, (err) => {
    console.log('running...')
})