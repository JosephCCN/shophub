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

    return (
        <div className='home_searchbar'>
            <table>
                <tr>
                    <td>
                        <input type="text" name="search" placeholder="type your interested product" onChange={(e) => setSearchKey(e.target.value)}/>
                    </td>
                    <td><button type="submit" onClick={search}>search</button></td>
                </tr>
            </table>
        </div>
    )
}

export default Bar;