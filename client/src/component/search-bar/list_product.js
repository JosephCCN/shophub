import {LoadProductPhoto, LoadProduct} from '../util/product'

function ListProduct(props) {
    const products = props.products;
    const L = Object.keys(products).length;
    let list = [];
    for(var i=0;i<L;i++) {
        const cur = products[i];
        const cur_product_id = cur['product_id']
        const price = ['price']
        const seller = ['seller']
        list.push(
            <LoadProductPhoto productid={cur_product_id}/>,
            <LoadProduct productid={cur_product_id} entities={price}/>,
        );
    }
    return (
        <div>
            <p>{list}</p>
        </div>
    )
}

export default ListProduct;