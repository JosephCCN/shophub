var express = require('express');
var router = express.Router();
const fs = require('fs')
const multer = require('multer')
var path = require('path')
const db = require('../db')

router.get('/product_img', async(req, res) => {
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

router.get('/product', async(req, res) => {
    productid = req.query.productid;
    try{
        result = await db.query(`select * from product where product_id=${productid} and is_deleted='f'`);
        if(result.rows == []) {
            res.json({'empty': 1});
            return;
        }
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
})

//with deleted product
router.get('/product_all', async(req, res) => {
    productid = req.query.productid;
    try{
        result = await db.query(`select * from product where product_id=${productid}`);
        if(result.rows == []){
            res.json({'empty': 1});
            return;
        }
    }
    catch(err){
        res.json({'err': err});
    }
    res.json(result.rows);
})

router.get('/product_name', async(req, res) => {
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

router.get('/all_products', async(req, res) => {
    try {
        result = await db.query(`select * from product where is_deleted=false`);
        res.json(result.rows)
    }
    catch(err) {
        res.json({'err':err});
    }
})

router.post('/delete_img', async(req, res) => {
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

router.get('/maxproductid', async(req, res) => {
    try{
        result = await db.query(`select last_value from product_product_id_seq`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
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

router.post('/add_product', upload.single('image'), async(req, res) => {
    productid = req.body.productid;
    userid = req.body.userid;
    productname = req.body.productname.replace('\'', '\'\'');
    productinfo = req.body.productinfo.replace('\'', '\'\'');
    price = req.body.price;
    quantity = req.body.quantity;
    category = req.body.category;
    //make category list
    const L = Object.keys(category).length;
    var category_list = [];
    var tmp = '';
    for(var i=0;i<L;i++){
        if(category[i] == ',') category_list.push(tmp), tmp = ''
        else tmp = tmp + category[i];
    }

    try{
        result = await db.query(`insert into product (seller_id, product_name, info, price, quantity) values (${userid}, '${productname}', '${productinfo}', ${price}, ${quantity})`);
        const L = Object.keys(category_list).length;
        for(var i=0;i<L;i++){
            const cur_category = category_list[i]
            result2 = await db.query(`insert into category (product_id, tag) values (${productid}, '${cur_category}')`)
        }
        res.json({'success': 1});
    }
    catch(err){
        res.json({'err':err});
        return;
    }
})


router.post('/edit_product', upload.single('image'), async(req, res) => {
    productid = req.body.productid;
    productname = req.body.productname.replace('\'', '\'\'') || '';
    productinfo = req.body.productinfo.replace('\'', '\'\'') || '';
    console.log(productinfo);
    price = req.body.price;
    quantity = req.body.quantity;
    category = req.body.category;

    //make category list
    const L = Object.keys(category).length;
    var category_list = [];
    var tmp = '';
    for(var i=0;i<L;i++){
        if(category[i] == ',') category_list.push(tmp), tmp = ''
        else tmp = tmp + category[i];
    }


    try{
        add_noti(`The product ${productname} has been edited! Click to check!`, productid)
        result = await db.query(`update product set (product_name, info, price, quantity) = ('${productname}', '${productinfo}', ${price}, ${quantity}) where product_id=${productid}`);
        result1 = await db.query(`delete from category where product_id = ${productid}`)
        const L = Object.keys(category_list).length;
        for(var i=0;i<L;i++){
            const cur_category = category_list[i]
            result2 = await db.query(`insert into category (product_id, tag) values (${productid}, '${cur_category}')`)
        }
        res.json({'success': 1});
    }
    catch(err){
        res.json({'err': err});
        return;
    }
})

router.post('/delete_product', async(req, res) => {
    productid = req.body.productid;
    try{
        const res1 = await db.query(`select product_name from product where product_id=${productid}`);
        const productname = res1.rows[0]['product_name']
        add_noti(`The product ${productname} has been deleted! Buy it earlier next time!`, productid)
        result = await db.query(`update product set is_deleted = true where product_id=${productid}`);
        result = await db.query(`delete from cart where product_id=${productid}`)
        result = await db.query(`delete from wishlist where product_id=${productid}`)
        res.json({'success': 1});
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
})

add_noti = async(msg, productid) => {
    const fetch_user = await db.query(`select user_id from wishlist where product_id = ${productid}`)
    const userlist = fetch_user.rows
    const L = Object.keys(userlist).length
    for(var i=0;i<L;i++){
        const cur_user_id = userlist[i]['user_id'];
        const fetch_num_of_noti = await db.query(`select count(*) from noti where user_id = ${cur_user_id}`);
        const number_of_noti = fetch_num_of_noti.rows[0]['count']
        if(number_of_noti == 10){
            await db.query(`delete from noti where create_at = (select create_at from noti order by create_at asc limit 1) `);
        }
        await db.query(`insert into noti (user_id, context, product_id) values (${cur_user_id}, '${msg}', ${productid})`)
    }
}


module.exports = router;