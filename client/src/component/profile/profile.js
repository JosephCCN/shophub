import { Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'
import {GetUserName, Get, GetProduct} from '../util/util'

function Product(prop) {
    const cur = prop.cur;

    return (
        <p>Product Name: {cur['product_name']} ${cur['price']}</p>
    );
}

function Actual_profile() {
    const cookies = new Cookies();
    const userid = cookies.get('userid');
    const username = GetUserName(userid);

    const fetch_sell_product = () => {
        var {data, isLoading} = Get(`http://localhost:3030/seller_product?id=${userid}`)
        var sell_products;
        if(isLoading) sell_products = []
        else sell_products = data
        var sell_product_list = []
        var L = Object.keys(sell_products).length;
        for(var i=0;i<L;i++) {
            const cur = sell_products[i];
            sell_product_list.push(
                <Product cur={cur}/>
            )
        }
        return sell_product_list;
    }

    const fetch_buy_history = () => {
        var {data, isLoading} = Get(`http://localhost:3030/buyer_history?id=${userid}&top=${10}`)
        var buy_history = [];
        if(isLoading) buy_history = []
        else buy_history = data
        console.log(buy_history)
        var buy_history_list = []
        var L = Object.keys(buy_history).length;
        for(var i=0;i<L;i++) {
            const cur = buy_history[i];
            const seller = GetUserName(cur['seller_id']);
            const product = GetProduct(cur['product_id']);
            buy_history_list.push(
                <Product cur={product}/>
            )
        }
        return buy_history_list;
    }

    var sell_product_list = fetch_sell_product();
    var buy_history_list = fetch_buy_history();

    return (
        <div>
            <h1>{username}</h1>
            <h2>Selling Items:</h2>
            <p>{sell_product_list}</p>
            <h2>Buy Items:</h2>
            <p>{buy_history_list}</p>
        </div>
    );
}

function Profile() {
  const cookies = new Cookies();
  const userid = cookies.get('userid');
  if(!userid) {
    return (<Navigate to='/login'/>);
  }
  else {
    return(<Actual_profile/>);
  }
}

export default Profile;