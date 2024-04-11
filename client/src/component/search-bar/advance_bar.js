import { useState, useEffect, useRef} from "react";
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios'
import "./css/advance_bar.css";
import Cookies from 'universal-cookie'
import { useParams, useNavigate, Navigate } from "react-router-dom";

function AdvanceBar(props) {

    const cookies = new Cookies;
    const navigate = useNavigate();

    const [isLoading, setisLoading] = useState(true);
    const [lower, setLower] = useState(0);
    const [upper, setUpper] = useState(5000);
    const [searched, setSearched] = useState(false);
    const [search_key, setSearchKey] = useState('');


    const [selectedOptions, setSelectedOptions] = useState([]);

    const onSelectOptions = (selectedList, selectedItem) => {
        setSelectedOptions(selectedList);    
    };
    const onRemoveOptions = (selectedList, removedItem) => {
        setSelectedOptions(selectedList);  
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

    useEffect(() => {
        if(!searched) return;
        navigate('/adv')
    }, [searched])

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

        cookies.set('categories', selectedOptions, {
            path: '/'
        })
        cookies.set('key', search_key, {
            path: '/'
        })
        cookies.set('lower', lower, {
            path: '/'
        })
        cookies.set('upper', upper, {
            path: '/'
        })

        setSearched(true);

    }
    return (
        <div>
            <table>
                <tr>
                    <td>
                    <div className="advance_bar">
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
                                <td><Multiselect className="multi"
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
                            </tr>
                        </table>
                        </div>
                    </td>
                    <td>
                        <div className="home_searchbar">
                            <input type="text" name="search" placeholder="type your interested product" onChange={(e) => setSearchKey(e.target.value)}/>
                        </div>
                    </td>
                    <td><button onClick={search} className="search_btn">Search</button></td>
                </tr>
            </table>
            
        </div>
    )
}

export default AdvanceBar;