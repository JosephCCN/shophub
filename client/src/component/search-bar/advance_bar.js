import { useState, useEffect, useRef} from "react";
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios'

function AdvanceBar(props) {
    const [isLoading, setisLoading] = useState(true);
    const [lower, setLower] = useState(0);
    const [upper, setUpper] = useState(5000);


    const [selectedOptions, setSelectedOptions] = useState([]);
    const [removedOptions, setRemovedOptions] = useState([]);

    const onSelectOptions = (selectedList, selectedItem) => {
        setSelectedOptions([...selectedOptions, selectedItem]);   
    };
    const onRemoveOptions = (selectedList, removedItem) => {
        setRemovedOptions([...removedOptions, removedItem]);
    };

    const [categories, setcategories] = useState([]);

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
            setcategories(list);
            setisLoading(false);
        }
        fetch_categories();
    }, [])

    if(isLoading) return <p>Loading...</p>


    const handleMin = (e) => {
        if(e.target.value < upper && e.target.value != '') {
            setLower(e.target.value);
        }
    }

    const handleMax = (e) => {
        if(e.target.value > lower && e.target.value != '') {
            setUpper(e.target.value);
        }
    }

    const search = () => {
        axios.post(`http://localhost:3030/adv_search`, {
            categories: [selectedOptions],
            lower: lower,
            upper: upper
        })
        .then(res => {
            if(res.data['err']) {
                console.log(res.data['err']);
                return;
            }
            props.setProductInfo(res.data);
            props.setSearched(true);
        })
        .catch(err => console.log(err))
    }
    return (
        <div>
            <table>
                <tr>
                    <td>Price Range</td>
                    <td>
                        <input type="number" min="0.0" max="5000.0" step="0.1" onChange={handleMin} value={lower}/>
                        -<input type="number" min="0.0" max="5000.0" step="0.1" onChange={handleMax} value={upper}/>
                    </td>
                </tr>
                <tr>
                    <td>Categories</td>
                    <td><Multiselect
                            options={categories}
                            name="particulars"
                            displayValue='name'
                            closeIcon='cancel'
                            onSelect={onSelectOptions}
                            onRemove={onRemoveOptions}
                            selectedValues={''}
                            selectionLimit={5}
                            />
                    </td>
                </tr>
                <tr>
                    <td><button onClick={search}>Search</button></td>
                </tr>
            </table>
        </div>
    )
}

export default AdvanceBar;