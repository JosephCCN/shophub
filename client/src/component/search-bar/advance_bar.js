import { useState, useEffect, useRef} from "react";
import RangeSlider from 'react-range-slider-input'
import 'react-range-slider-input/dist/style.css';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios'

function AdvanceBar(props) {
    const [search_key, setSearchKey] = useState();
    const [categories, setcategories] = useState('');
    const [isLoading, setisLoading] = useState(true);
    const [lower, setLower] = useState(0);
    const [upper, setUpper] = useState(5000);


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

    const handleCat = (e) => {
        setcategories(e.target.value)
    }

    const search = () => {
        axios.post(`http://localhost:3030/adv_search`, {
            categories: [categories],
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
            <label>Price Range</label><br/>
            Min:<input type="number" min="0.0" max="5000.0" step="0.1" onChange={handleMin} value={lower}/>
            Max:<input type="number" min="0.0" max="5000.0" step="0.1" onChange={handleMax} value={upper}/><br/>
            categories: <input onChange={handleCat}/>
            <button onClick={search}>Search</button>
        </div>
    )
}

export default AdvanceBar;