import './css/home_searchbar.css';
import { useEffect, useState } from "react";

import { Navigate, Link, useNavigate } from "react-router-dom";

function Bar() {
    const [search_key, setSearchKey] = useState();
    const [search, setSearch] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if(!search) return;
        navigate(`/ss/${search_key}`)
    }, [search])

    return (
        <div className='home_searchbar'>
            <table>
                <tr>
                    <td>
                        <input type="text" name="search" placeholder="type your interested product" onChange={(e) => setSearchKey(e.target.value)}/>
                    </td>
                    <td><button type="submit" onClick={() => {setSearch(search + 1)}}>search</button></td>
                </tr>
            </table>
        </div>
    )
}

export default Bar;