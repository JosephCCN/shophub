//This is a component called by other component to show history, not directly used

import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'


const find_user = (id) => {
    axios.get(`http://localhost:3030/username?id=${id}`)
    .then(res => {
        return res.data[0]['username'];
    })
    .catch(err => {
        console.log(err);
        return err;
    })
}

const find_product = (id) => {
    axios.get(`http://localhost:3030/productname?id=${id}`)
    .then(res => {
        return res.data[0]['product_name'];
    })
    .catch(err => {
        console.log(err);
        return err;
    })
}

const seller_history = async(id, amount) => {
    await axios.get(`http://localhost:3030/seller_history?id=${id}&top=${amount}`)
    .then(res =>{
        return res.data
    })
    .catch(err => {
        return err
    })
}

const buyer_history = async(id, amount) => {
    await axios.get(`http://localhost:3030/buyer_history?id=${id}&top=${amount}`)
    .then(res =>{
        return res.data
    })
    .catch(err => {
        return err
    })
}


function History(props) { //seller, amount, id
    var result = [];

    //fetch history from db
    if(props.seller) {
        result = seller_history(props.id, props.amount);
        console.log(result);
    }
    else{
        result = buyer_history(props.id, props.amount);
    }

    var list = []
    var L = Object.keys(result).length;
    console.log(props.id, props.amount, result);

    //used to define which id should be fetch 
    var op;
    if(props.seller) op = 'buyer';
    else op = 'seller';

    for(var i=0;i<L;i++) {
        const cur = result[i];
        console.log(cur);
        list.push(
            <p>{find_product[cur['product_id']]}: {find_user(cur[op])}</p>
        )
    }

    return (
        <div>
            <p>Hi</p>
            {list}
        </div>
    )
}

export default History;