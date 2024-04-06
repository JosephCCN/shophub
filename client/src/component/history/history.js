//This is a component called by other component to show history, not directly used

import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'
import LoadProductPhoto from "../util/product"
import Username from "../util/user"

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
        cur_order_table.push(<tr><td></td><td>Seller</td><td>Product Name</td><td>Quantity</td><td>Price</td><td>Order Date</td><td></td></tr>)
        for(var j=0;j<L2;j++){
            var cur_product_table = []
            cur_product_table.push(<td>{cur_order_list[j]['product_img']}</td>)
            cur_product_table.push(<td>{cur_order_list[j]['seller_name']}</td>)
            cur_product_table.push(<td>{cur_order_list[j]['product_name']}</td>)
            cur_product_table.push(<td>{cur_order_list[j]['quantity']}</td>)
            cur_product_table.push(<td>{cur_order_list[j]['price']}</td>)
            cur_product_table.push(<td>{cur_order_list[j]['order_date']}</td>)
            cur_product_table.push(cur_order_list[j]['review'])
            cur_order_table.push(<tr>{cur_product_table}</tr>)
        }
        var temp = <center> <table>{cur_order_table}</table> </center>
        list.push(temp)
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
            const res = await axios.get(`http://localhost:3030/orderid?userid=${userid}&top=${top}`)
            const tmp = res.data
            var list = []
            const L = Object.keys(tmp).length;
            for(var i=0;i<L;i++){
                const cur = tmp[i];
                const result = await axios.get(`http://localhost:3030/order?orderid=${cur['order_id']}`)
                var cur_order_list = result.data;
                const L2 = Object.keys(cur_order_list).length;
                for(var j=0;j<L2;j++){
                    //fetch seller username by seller_id
                    console.log(cur_order_list[j])
                    const cur_seller_id = cur_order_list[j]['seller_id']
                    //add to order_list
                    cur_order_list[j]['seller_name'] = <Username userid={cur_seller_id}/>
                    
                    //fetch product_name by product_id
                    const cur_product_id = cur_order_list[j]['product_id']
                    const res2 = await axios.get(`http://localhost:3030/product?productid=${cur_product_id}`)
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
                        const res5 = await axios.get(`http://localhost:3030/review?productid=${cur_product_id}&userid=${userid}`)
                        //add review button to order_list
                        if(!res5.data[0]['exist']) cur_order_list[j]['review'] = <td><button onClick={() => gotoreview(`/product/${cur_product_id}`)}>Add Review</button></td>;
                        else cur_order_list[j]['review'] = <td><button onClick={() => gotoreview(`/product/${cur_product_id}`)}>Edit Review</button></td>;
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
    tmp.push(<tr><td></td><td>Seller</td><td>Product Name</td><td>Quantity</td><td>Price</td><td>Order Date</td><td></td></tr>)
    for(var i=0;i<L;i++){
        const cur_sales_list = infolist[i];
        var column = []
        column.push(<td>{cur_sales_list['product_img']}</td>)
        column.push(<td>{cur_sales_list['buyer_name']}</td>)
        column.push(<td>{cur_sales_list['product_name']}</td>)
        column.push(<td>{cur_sales_list['quantity']}</td>)
        column.push(<td>{cur_sales_list['price']}</td>)
        column.push(<td>{cur_sales_list['order_date']}</td>)
        tmp.push(<tr>{column}</tr>)
    }

    var temp2 = <center> <table>{tmp}</table> </center>
    list.push(temp2)
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
            const res = await axios.get(`http://localhost:3030/seller_history?userid=${userid}&top=${top}`)
            const tmp = res.data
            var list = []
            console.log(tmp)
            const L = Object.keys(tmp).length;
            for(var i=0;i<L;i++){
                var cur_sales_list = tmp[i];
                console.log(cur_sales_list)
                //fetch buyer username by buyer_id
                const cur_buyer_id = cur_sales_list['buyer_id']
                //add to sales_list
                cur_sales_list['buyer_name'] = <Username userid={cur_buyer_id}/>
                
                //fetch product_name by product_id
                const cur_product_id = cur_sales_list['product_id']
                const res2 = await axios.get(`http://localhost:3030/product?productid=${cur_product_id}`)
                //add to sales_list
                cur_sales_list['product_name'] = res2.data[0]['product_name']

                //fetch product_image by product_id and add to sales_list
                cur_sales_list['product_img'] = <LoadProductPhoto productid={cur_product_id}/>;
                list.push(cur_sales_list)
            }
            console.log(list)
            setsaleslist(list)
            setLoading(false)
        }
        fetch();
    }, [])

    if(isLoading) return <p>Loading...</p>;
    else return SalesHistoryInfoSource(saleslist)
}