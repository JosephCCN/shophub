import {useNavigate, Navigate} from 'react-router-dom'
import {useState, useEffect, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Multiselect from 'multiselect-react-dropdown';
import PageHeader from '../util/miss';
var FormData = require('form-data')

function AddProduct(props) {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    const [isLoading, setisLoading] = useState(true)
    if(!userid) navigate('/login');

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
    const handleaddproduct = async(e) => {
        try{
            //make category as string
            const L = Object.keys(selectedOptions).length;
            var category = ''
            for(var i=0;i<L;i++){
                category = category + selectedOptions[i]['name'] + ','
            }
            //fetch maximum productid
            const res1 = await axios.get(`http://localhost:3030/maxproductid`)
            const nextproductid = parseInt(res1.data[0]['last_value'], 10) + 1

            //add image
            const dataform = new FormData();
            dataform.append('userid', userid);
            dataform.append('productname', productname);
            dataform.append('productinfo', productinfo);
            dataform.append('price', price);
            dataform.append('quantity', quantity);
            dataform.append('productid', nextproductid);
            dataform.append('category', category);
            dataform.append('image', image);
            const res2 = await axios.post('http://localhost:3030/add_product', dataform)
            //go back to seller page
            navigate('/seller');
        }
        catch(err){
            setErr(err)
            console.log(err)
        }      
    }
    const [categorylist, setcategorylist] = useState(0);
    useEffect(() => {
        const fetch_categories = async() =>{
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
        fetch_categories();
    }, [])

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

    if(isLoading) return <p>Loading</p>;
    return (
        <body>
            <PageHeader/>
            <div>
                <button onClick={goBack}>Back</button>
                <h1>Add Product Page</h1>
                <label>Product Name:</label><input type="text" onChange={(e) => setproductname(e.target.value)}/>
                <br/>
                <label>Product Info:</label><input type="text" onChange={(e) => setproductinfo(e.target.value)}/>
                <br/>
                <label>Quantity:</label><input type="text" onChange={(e) => setquantity(e.target.value)}/>
                <br/>
                <label>Price:</label><input type="text" onChange={(e) => setprice(e.target.value)}/>
                <br/>
                <label>Category: (at most 5)</label><Multiselect
                    options={categorylist}
                    name="particulars"
                    displayValue='name'
                    closeIcon='cancel'
                    onSelect={onSelectOptions}
                    onRemove={onRemoveOptions}
                    selectedValues={''}
                    selectionLimit={5}
                    />
                <br/>
                <label>Producat Image:</label><input onChange={(e)=>{setImage(e.target.files[0])}} name="product_image" type="file"></input>
                <br/>
                <button type="submit" onClick={handleaddproduct}> Add Product</button>
            </div>
        </body>
    )
    
}

export default AddProduct;