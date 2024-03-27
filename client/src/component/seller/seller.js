import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'
import History from '../history/history'

function Sell(props) {

    const cookies = new Cookies();
    const navigate = useNavigate();
    var userid;

    useEffect(() => {
       userid = cookies.get('userid');
       if(!userid) navigate('/login');
    } ,[])

    return (
        <div>
            <h1>Seller Page</h1>
            <History seller={true} amount={10} id={2}/>
        </div>
    )
}

export default Sell;