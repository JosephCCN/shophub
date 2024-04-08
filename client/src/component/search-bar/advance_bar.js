import './css/home_searchbar.css';
import { useState } from "react";
import axios from 'axios'

function Bar(props) {
    const [search_key, setSearchKey] = useState();

    const search = () => {
        axios(`http://localhost:3030/search?key=${search_key}`)
        .then((res) => {
            props.setProductInfo(res.data);
            props.setSearched(true);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`http://localhost:3030/seller_product?id=${userid}&asc=1`) //fetch seller products product_id
            setlist(res.data)
            setLoading(false)
        }
        fetch();
    }, [])

    // return (
    //     <div className='home_searchbar'>
    //         <input type="text" name="search" placeholder="type your interested cate" onChange={(e) => setSearchKey(e.target.value)}/>
    //         <button type="submit" onClick={search}>search</button>
    //     </div>
    // )

    return (
        <div>
            <label>Category: (at most 5)</label><Multiselect
                options={categories}
                name="particulars"
                displayValue='name'
                closeIcon='cancel'
                onSelect={onSelectOptions}
                onremove={onRemoveOptions}
                selectedValues={''}
                selectionLimit={5}
                />
        </div>
    )
}

export default Bar;