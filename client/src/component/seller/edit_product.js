import './css/edit_product.css';
import {useNavigate, Navigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Multiselect from 'multiselect-react-dropdown';
import LoadProductPhoto from '../util/product'
import PageHeader from '../util/miss';

function EditProduct(prop) {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    const productid = cookies.get('productid');
    if(!userid) navigate('/login');
    if(!productid) navigate('/seller');
    const [isLoading, setisLoading] = useState(true);

    const [product, setproduct] = useState([]);
    const [img_source, setimg_source] = useState();
    const [categorylist, setcategorylist] = useState(0);
    //fetch product and image with productid, fetch category list
    useEffect(() => {
        const fetch = async() => {
            //fetch product
            const res = await axios.get(`http://localhost:3030/product?productid=${productid}`) //fetch product with productid
            setimg_source(<LoadProductPhoto productid={productid}/>)
            setproduct(res.data);

            //fetch category_list
            const result = await axios.get(`http://localhost:3030/category_list`)
            var tmp = result.data;
            var list = [];
            const L = Object.keys(tmp).length;
            for(var i=0;i<L;i++){
                const cur_category = tmp[i]['tag']
                list.push({name: cur_category, id: i+1});
            }
            setcategorylist(list);
            setisLoading(false);
        }
        fetch();
    }, [])

    const [productname, setproductname] = useState();
    const [productinfo, setproductinfo] = useState();
    const [price, setprice] = useState();
    const [quantity, setquantity] = useState();
    const [image, setImage] = useState();
    const [err, setErr] = useState();

     //multiselect
    const [selectedOptions, setSelectedOptions] = useState([]);
    const onSelectOptions = (selectedList, selectedItem) => {
        setSelectedOptions(selectedList);   
        // setSelectedOptions([...selectedOptions, selectedItem]);   
    };
    const onRemoveOptions = (selectedList, removedItem) => {
        setSelectedOptions(selectedList);   
        // setRemovedOptions([...removedOptions, removedItem]);
    };
    const handleeditproduct = async(e) => {
        try{
            //make category as string
            const L = Object.keys(selectedOptions).length;
            var category = ''
            for(var i=0;i<L;i++){
                category = category + selectedOptions[i]['name'] + ','
            }
            const res1 = await axios.post('http://localhost:3030/delete_img',{
                'productid': productid
            })
            //edit entries in database
            const dataform = new FormData();
            dataform.append('userid', userid);
            dataform.append('productname', productname);
            dataform.append('productinfo', productinfo);
            dataform.append('price', price);
            dataform.append('quantity', quantity);
            dataform.append('category', category);
            dataform.append('productid', productid);
            dataform.append('image', image);
            const res2 = await axios.post('http://localhost:3030/edit_product', dataform)
            //remove cookies
            cookies.remove('productid', {
            path: '/'
            });
            navigate('/seller');
        }
        catch(err){
            setErr(err)    //set error msg
            console.log(err) //cannot update product, thus return
        }
    } 

    // go back
    var [back, setBack] = useState(false);
    useEffect(() => {
        if(back) {
            back = false;
            navigate(-1);
        }
    }, [back])
    const goBack = () => {
        setBack(true);
    }

    if(isLoading) return <p>Loading...</p>;
    console.log(categorylist, 1)
    return (
        <body>
            <PageHeader/>
            <div className='edit_product'>
                <h1>Edit your product</h1>
                <center>
                <table>
                    <tr>
                        <td><label>Product Name:</label></td>
                        <td><label>{product[0]['product_name']}</label></td>
                        <td><input type="text" onChange={(e) => setproductname(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td><label>Product Info:</label></td>
                        <td><label>{product[0]['info']}</label></td>
                        <td><input type="text" onChange={(e) => setproductinfo(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td><label>Quantity:</label></td>
                        <td><label>{product[0]['quantity']}</label></td>
                        <td><input type="text" onChange={(e) => setquantity(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td><label>Price:</label></td>
                        <td><label>{product[0]['price']}</label></td>
                        <td><input type="text" onChange={(e) => setprice(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td><label>Product Image:</label></td>
                        {img_source}
                        <td><input onChange={(e)=>{setImage(e.target.files[0])}} name="image" type="file"></input></td>
                    </tr>
                    <tr>
                        <td><label>Category: </label></td>
                        <td><label>{product[0]['category']}</label></td>
                        <td><Multiselect className="multiselect_dropdown"
                                options={categorylist}
                                name="particulars"
                                displayValue='name'
                                closeIcon='cancel'
                                onSelect={onSelectOptions}
                                onRemove={onRemoveOptions}
                                selectedValues={''}
                                selectionLimit={5}/></td>
                    </tr>
                </table>
                </center>
                <br/>
                <br/>
                <button type="submit" onClick={handleeditproduct}>Save</button>
            </div>
            <button onClick={goBack}>Back</button>
        </body>
    )
    
}

export default EditProduct;