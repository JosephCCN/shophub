import { useState } from "react";

function Bar(props) {
    const [search_key, setSearchKey] = useState();

    const search = () => {
        props.setProductInfo({'item1':'fuck', 'item2':'test2'});
    }

    return (
        <div>
            <label>Search:</label><input type="text" onChange={(e) => setSearchKey(e.target.value)}/>
            <button type="submit" onClick={search}>search</button>
        </div>
    )
}

export default Bar;