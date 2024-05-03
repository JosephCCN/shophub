//This is a component called by other component to show history, not directly used

import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import LoadProductPhoto from "../util/product"
import Username from "../util/user"
import './history.css'

function OrderHistoryInfoSource(infolist){
    var list = []
    const L = Object.keys(infolist).length;

    if(L == 0){
        return <p>No History!! Buy your first item!</p>
    }
    for(var i=0;i<L;i++){
        const cur_order_list = infolist[i];
        const L2 = Object.keys(cur_order_list).length;
        var cur_order_table = []
        //set up column
        for(var j=0;j<L2;j++){
            const cur_product = cur_order_list[j];
            const cur_date = new Date(cur_product['order_date'])
            var row = []
            row.push(<td>{cur_product['product_img']}</td>)
            var product_info = [<td><table className="first_col"><tr><th>{cur_product['seller_name']}</th></tr><tr><td>{cur_product['product_name']}</td></tr></table></td>]
            product_info.push(<td><table className="second_col"><tr><td>Quantity: {cur_product['quantity']}</td></tr><tr><td>Price: ${cur_product['price'] * cur_product['quantity']}</td></tr></table></td>)
            product_info.push(<td>Order Time:<br/>{cur_date.toLocaleDateString()}<br/>{cur_date.getHours()}:{cur_date.getMinutes()}:{cur_date.getSeconds()}</td>)
            product_info.push(cur_product['review'])
            row.push(product_info)
            cur_order_table.push(<tr><td><center><table className="orderproduct"><tr>{row}</tr></table></center></td></tr>)
        }
        var temp = <center> <table className="ordertable">{cur_order_table}</table> </center>
        list.push(temp, <p></p>)
    }

    return list
}

// this function shows the order history of a user
// remark: will show deleted product, review not edittable
// input: userid, top
export function ShowOrderHistory(prop) {
    const userid = prop.userid
    const top = prop.top
    const [isLoading, setLoading] = useState(true);
    const [orderlist, setorderlist] = useState([]);

    const navigate = useNavigate();
    var [goreviewpage, setgoreview] = useState(0);
    function gotoreview(path_to_product){
        setgoreview(path_to_product)
    }
    useEffect(() => {
        if(!goreviewpage) return;
        navigate(goreviewpage);
        goreviewpage = 0;
    }, [goreviewpage])

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`/orderid?userid=${userid}&top=${top}`)
            const tmp = res.data
            var list = []
            const L = Object.keys(tmp).length;
            for(var i=0;i<L;i++){
                const cur = tmp[i];
                const result = await axios.get(`/order?orderid=${cur['order_id']}`)
                var cur_order_list = result.data;
                const L2 = Object.keys(cur_order_list).length;
                for(var j=0;j<L2;j++){
                    //fetch seller username by seller_id
                    const cur_seller_id = cur_order_list[j]['seller_id']
                    //add to order_list
                    cur_order_list[j]['seller_name'] = <Username userid={cur_seller_id}/>
                    
                    //fetch product_name by product_id
                    const cur_product_id = cur_order_list[j]['product_id']
                    const res2 = await axios.get(`/product_all?productid=${cur_product_id}`)
                    //add to order_list
                    cur_order_list[j]['product_name'] = res2.data[0]['product_name']

                    //fetch product_image by product_id and add to order_list
                    cur_order_list[j]['product_img'] = <LoadProductPhoto productid={cur_product_id}/>;

                    //check if product is deleted or not;
                    if(res2.data[0]['is_deleted']){
                        cur_order_list[j]['review'] = <td>Deleted, Cannot Add Review</td>
                    }
                    else{
                        //check if there is any review for the specific prodduct
                        const res5 = await axios.get(`/review?productid=${cur_product_id}&userid=${userid}`)
                        //add review button to order_list
                        if(!res5.data[0]['exist']) cur_order_list[j]['review'] = <td><button onClick={() => gotoreview(`/product/${cur_product_id}`)} className="review">Add Review</button></td>;
                        else cur_order_list[j]['review'] = <td><button onClick={() => gotoreview(`/product/${cur_product_id}`)} className="reivew">Edit Review</button></td>;
                    }
                    //add specific product page to order_list
                    cur_order_list[j]['path_to_product'] = `/product/${cur_product_id}`
                }
                list.push(cur_order_list)
            }
            setorderlist(list)
            setLoading(false)
        }
        fetch();
    }, [])

    if(isLoading) return <p>Loading...</p>;
    else return OrderHistoryInfoSource(orderlist)
}


function SalesHistoryInfoSource(infolist){
    var list = []
    const L = Object.keys(infolist).length;


    if(L == 0){
        return <p>No Sales History Found!!</p>
    }

    var tmp = []
    for(var i=0;i<L;i++){
        const cur_sales_list = infolist[i];
        const cur_date = new Date(cur_sales_list['order_date'])
        var row = []
        row.push(<td>{cur_sales_list['product_img']}</td>)
        var product_info = [<td><table className="first_col"><tr><th>{cur_sales_list['buyer_name']}</th></tr><tr><td>{cur_sales_list['product_name']}</td></tr></table></td>]
        product_info.push(<td><table className="second_col"><tr><td>Quantity: {cur_sales_list['quantity']}</td></tr><tr><td>Price: ${cur_sales_list['price'] * cur_sales_list['quantity']}</td></tr></table></td>)
        product_info.push(<td>Order Time:<br/>{cur_date.toLocaleDateString()}<br/>{cur_date.getHours()}:{cur_date.getMinutes()}:{cur_date.getSeconds()}</td>)
        row.push(product_info)
        tmp.push(<center><table className="historytable"><tr>{row}</tr></table></center>,<p></p>)
    }
    list.push(tmp)
    return list
}

// this function shows the sales history of a user
// remark: will not show deleted product
// input: userid, top
export function ShowSalesHistory(prop) {
    const userid = prop.userid
    const top = prop.top
    const [isLoading, setLoading] = useState(true);
    const [saleslist, setsaleslist] = useState([]);

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`/seller_history?userid=${userid}&top=${top}`)
            const tmp = res.data
            var list = []
            const L = Object.keys(tmp).length;
            for(var i=0;i<L;i++){
                var cur_sales_list = tmp[i];
                // console.log(cur_sales_list)
                //fetch buyer username by buyer_id
                const cur_buyer_id = cur_sales_list['buyer_id']
                //add to sales_list
                cur_sales_list['buyer_name'] = <Username userid={cur_buyer_id}/>
                //fetch product_name by product_id
                const cur_product_id = cur_sales_list['product_id']
                const res2 = await axios.get(`/product?productid=${cur_product_id}`)
                //add to sales_list
                cur_sales_list['product_name'] = res2.data[0]['product_name']

                //fetch product_image by product_id and add to sales_list
                cur_sales_list['product_img'] = <LoadProductPhoto productid={cur_product_id}/>;
                list.push(cur_sales_list)
            }
            setsaleslist(list)
            setLoading(false)
        }
        fetch();
    }, [])

    if(isLoading) return <p>Loading...</p>;
    else return SalesHistoryInfoSource(saleslist)
}

export function ShowProductHistory(prop){
    const productid = prop.productid
    const top = prop.top
    const [isLoading, setLoading] = useState(true);
    const [historylist, setHistoryList] = useState([]);

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`/order_product?productid=${productid}`)
            const tmp = res.data
            var list = []
            const L = Object.keys(tmp).length;
            for(var i=0;i<L;i++){
                var cur_history = tmp[i];
                // console.log(cur_sales_list)
                //fetch buyer username by buyer_id
                const cur_buyer_id = cur_history['buyer_id']
                //add to sales_list
                cur_history['buyer_name'] = <Username userid={cur_buyer_id}/>
                //fetch product_name by product_id
                const res2 = await axios.get(`/product?productid=${productid}`)
                //add to sales_list
                cur_history['product_name'] = res2.data[0]['product_name']

                //fetch product_image by product_id and add to sales_list
                cur_history['product_img'] = <LoadProductPhoto productid={productid}/>;
                list.push(cur_history)
            }
            setHistoryList(list);
            setLoading(false)
        }
        fetch();
    }, [])

    if(isLoading) return <p>Loading...</p>;
    else return SalesHistoryInfoSource(historylist)
}