import {LoadProductPhoto, LoadProduct} from '../util/product'
import "./css/list_product.css";


function ListProduct(props) {
    const products = props.products;
    const L = Object.keys(products).length;
    let list = [];
    for(var i=0;i<L;i++) {
        const cur = products[i];
        const cur_product_id = cur['product_id']
        const entities = ['product_name', 'price', 'category']
        const prefix = ['', '$', 'Category: ']
        list.push(
            <div className='product_list'>
            <LoadProductPhoto productid={cur_product_id}/>,
            <LoadProduct productid={cur_product_id} entities={entities} prefix={prefix}/>
            </div>
        );
    }
    return (
        <div>
            {list}
        </div>
    )
}

export default ListProduct;