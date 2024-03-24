import { useState } from "react";
import axios from 'axios'

function Bar(props) {
    const [search_key, setSearchKey] = useState();

    const search = () => {
        axios(`http://localhost:3030/search?key=${search_key}`)
        .then((res) => {
            props.setProductInfo(res.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return (
        <div>
            <label>Search:</label><input type="text" onChange={(e) => setSearchKey(e.target.value)}/>
            <button type="submit" onClick={search}>search</button>
        </div>
    )
}

export default Bar;