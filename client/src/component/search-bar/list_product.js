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
        var row = [];
        for(var i=0;i<L && i < parseInt(top);i++) {
            const cur = products[i];
            const cur_product_id = cur['product_id']
            const entities = ['product_name', 'price']
            const prefix = ['', '$']

            if(i%5 == 0){
                tmp.push(
                    <tr>
                        {row}
                    </tr>
                );
                row = [];
            }
            
            row.push(
                <td>
                    <div className='product_list'>
                        <LoadProductPhoto productid={cur_product_id}/>
                        <LoadProduct productid={cur_product_id} entities={entities} prefix={prefix}/>
                    </div>
                </td>
                
            );
        }
        tmp.push(
            <tr>
                {row}
            </tr>
        );
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
                        <table>
                            <div className='product_result'>
                                {list}
                            </div>
                        </table>
                        
                    </td>
                </tr>
            </table>  
        </div>
    )
}

export default ListProduct;