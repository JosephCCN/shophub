import {useNavigate, Navigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Multiselect from 'multiselect-react-dropdown';
import LoadProductPhoto from '../util/product'

function EditProduct(prop) {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    const productid = cookies.get('productid');
    if(!userid) navigate('/login');
    if(!productid) navigate('/seller');
    const [isLoading1, setisLoading1] = useState(true);
    const [isLoading2, setisLoading2] = useState(true);

    const [product, setproduct] = useState([]);
    const [img_source, setimg_source] = useState();
    const [categories, setcategories] = useState(0);
    //fetch product and image with productid, fetch category list
    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`http://localhost:3030/product?productid=${productid}`) //fetch product with productid
            setimg_source(<LoadProductPhoto productid={productid}/>)
            setproduct(res.data);
            setisLoading1(false);
        }
        const fetch_categories = async() =>{
            const result = await axios.get(`http://localhost:3030/categories`)
            var tmp = result.data;
            var list = [];
            const L = Object.keys(tmp).length;
            for(var i=0;i<L;i++){
                const cur_category = tmp[i]['tag']
                list.push({name: cur_category, id: i+1});
            }
            setcategories(list);
            setisLoading2(false);
        }
        fetch();
        fetch_categories();
    }, [])

    const [productname, setproductname] = useState();
    const [productinfo, setproductinfo] = useState();
    const [price, setprice] = useState();
    const [quantity, setquantity] = useState();
    const [image, setImage] = useState();
    const [err, setErr] = useState();

     //multiselect
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [removedOptions, setRemovedOptions] = useState([]);
    const onSelectOptions = (selectedList, selectedItem) => {
        setSelectedOptions([...selectedOptions, selectedItem]);   
    };
    const onRemoveOptions = (selectedList, removedItem) => {
        setRemovedOptions([...removedOptions, removedItem]);
    };
    const handleeditproduct = async(e) => {
        try{
            //make category array
            var L = Object.keys(selectedOptions).length
            var category = 'array[';
            for(var i=0;i<L;i++){
                category = category + `'${selectedOptions[i]['name']}'`
                if(i != L-1) category = category + ', ';
            }
            category = category + ']'
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

    if(isLoading1 || isLoading2) return <p>Loading...</p>;
    return (
        <div>
            <button onClick={goBack}>Back</button>
            <h1>Edit Product Page</h1>
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
                    <td><label>Category:</label></td>
                    <td><label>{product[0]['category']}</label></td>
                    <td><Multiselect
                            options={categories}
                            name="particulars"
                            displayValue='name'
                            closeIcon='cancel'
                            onSelect={onSelectOptions}
                            onremove={onRemoveOptions}
                            selectedValues={''}
                            selectionLimit={5}/></td>
                </tr>
                <tr>
                    <td><label>Producat Image:</label></td>
                    {img_source}
                    <td><input onChange={(e)=>{setImage(e.target.files[0])}} name="image" type="file"></input></td>
                </tr>
            </table>
            </center>
            <button type="submit" onClick={handleeditproduct}>Save</button>
        </div>
    )
    
}

export default EditProduct;