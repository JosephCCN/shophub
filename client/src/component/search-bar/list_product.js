import { LoadProduct, LoadProductPhoto} from '../util/product';
import "./css/list_product.css";


function ListProduct(props) {

    const products = props.products;
    const L = Object.keys(products).length;
    let list = [];

    if(L == 0) return <h1>There is no product suit your criteria</h1>
    

    for(var i=0;i<L;i++) {
        const cur = products[i];
        const cur_product_id = cur['product_id']
        const entities = ['product_name', 'price']
        const prefix = ['', '$']

        
        list.push(
            <div className='product_list'>
                <LoadProductPhoto productid={cur_product_id}/>
                <LoadProduct productid={cur_product_id} entities={entities} prefix={prefix}/>
            </div>
        );
    }
    
    return (
        <div className='product_result'>
            {list}
        </div>
    )
}

export default ListProduct;