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
        const r2 = await db.query(`select tag from category where product_id=${productid}`);
        result.rows[0]['category'] = []
        for(var i=0;i<r2.rows.length;i++) {
            result.rows[0]['category'].push(r2.rows[i]['tag'])
        }
    }
    catch(err) {
        res.json({'err': err});
        return;
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
        result = await db.query(`select * from product`);
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


router.post('/edit_product', upload.single('image'), async(req, res) => {
    productid = req.body.productid;
    productname = req.body.productname.replace('\'', '\'\'');
    productinfo = req.body.productinfo.replace('\'', '\'\'');
    price = req.body.price;
    quantity = req.body.quantity;
    category = req.body.category;
    try{
        add_noti(`The product ${productname} has been edited! Click to check!`, productid)
        result = await db.query(`update product set (product_name, info, price, quantity, category) = ('${productname}', '${productinfo}', ${price}, ${quantity}, ${category}) where product_id=${productid}`);
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
        res.json({'success': 1});
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
})

module.exports = router;