import { LoadProduct, LoadProductPhoto} from '../util/product';
import { useEffect, useState } from 'react';
import "./css/list_product.css";


function ListProduct(props) {

    const [top, setTop] = useState(10);
    const [list, setList] = useState([]);
    var [isLoading, setLoading] = useState(false);

    const products = props.products;
    const L = Object.keys(products).length;


    const handleTopChange = (e) => {
        setLoading(true);
        setTop(e.target.value)
    }

    useEffect(() => {
        var tmp = []
        for(var i=0;i<L && i < parseInt(top);i++) {
            const cur = products[i];
            const cur_product_id = cur['product_id']
            const entities = ['product_name', 'price']
            const prefix = ['', '$']
    
            
            tmp.push(
                <div className='product_list'>
                    <LoadProductPhoto productid={cur_product_id}/>
                    <LoadProduct productid={cur_product_id} entities={entities} prefix={prefix}/>
                </div>
            );
        }
        setList(tmp);
        setLoading(false)
    }, [top])

    if(L == 0) return <h1>There is no product suit your criteria</h1>
    if(isLoading) return <p>Loading</p>
    
    
    return (
        <div>
            <table>
                <tr>
                    <td>
                    <div className='top'>
                        <table>
                            <tr>
                                <td>
                                    <label className='top_text'>Top:</label>
                                </td>
                                <td>
                                <select value={top} onChange={handleTopChange}>
                                    <option value='10'>10</option>
                                    <option value='20'>20</option>
                                    <option value='50'>50</option>
                                </select>
                                </td>
                            </tr>
                        </table>
                    </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className='product_result'>
                            {list}
                        </div>
                    </td>
                </tr>
            </table>  
        </div>
    )
}

export default ListProduct;