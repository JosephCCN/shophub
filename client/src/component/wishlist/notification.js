//This is a component called by other component to show notification, not directly used

import { useEffect, useState } from "react"
import axios from 'axios'
import {LoadProduct, LoadProductPhoto} from "../util/product"

function NotificationInfoSource(infolist){
    var list = []
    const L = Object.keys(infolist).length;

    // console.log(infolist)
    if(L == 0){
        return <p>No Notification!</p>
    }
    var tmp = []
    for(var i=0;i<L;i++){
        const cur_noti = infolist[i];
        console.log(cur_noti)
        const cur_noti_time = Object.entries(cur_noti['time'])
        var column = []
        column.push(<td>{cur_noti['img']}</td>)
        column.push(<td>{cur_noti['context']}</td>)
        column.push(<td><i>{cur_noti_time[0][1]} {cur_noti_time[0][0]} ago</i>{}</td>)
        tmp.push(<tr>{column}</tr>)
    }

    var temp2 = <center> <table>{tmp}</table> </center>
    list.push(temp2)
    return list
}

// this function shows the notification of a user
// remark: will show deleted product
// input: userid
export function ShowNotifcation(prop) {
    const userid = prop.userid
    const [isLoading, setLoading] = useState(true);
    const [notilist, setnotilist] = useState([]);

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`/user_notification?userid=${userid}`)
            var tmp = res.data;
            var list = []
            const L = Object.keys(tmp).length;
            for(var i=0;i<L;i++){
                var cur_noti = tmp[i];
                const cur_product_id = cur_noti['product_id'];
                cur_noti['img'] = <LoadProductPhoto productid={cur_product_id}/>
                list.push(cur_noti)
            }
            setnotilist(list)
            setLoading(false)
        }
        fetch();
    }, [])

    if(isLoading) return <p>Loading...</p>;
    console.log(notilist)
    return NotificationInfoSource(notilist)
}

export default ShowNotifcation;