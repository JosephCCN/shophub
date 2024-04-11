import { useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios'
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Rating } from 'react-simple-star-rating'
import Cookies from 'universal-cookie'
import Username from "../util/user";
import './review.css'

function Star(props) {
    const max = props.max;
    const active = props.active;
    const setActive = props.setActive;
    return (
        <Rating size={25}
            onClick={(e) => setActive(e)}
            initialValue={active}
            iconsCount={max}
            readonly={!props.edit}
        />
    )
}

function SingleReview(props) {
    const cur = props.cur;
    return (
        <div>
            <table className = "review_table">
                <tr><td><table className = "review_row"><tr><td><Username userid={props.userid}/></td>
                <td><Star max={5} active={cur['rating']} edit={false} setActive={() => {}}/></td></tr></table></td></tr>
                <tr><td>{cur['context']}</td></tr>
                </table>
                <p></p>
        </div>
    )
}

function UserReview(props) {
    const myReview = props.myReview;
    const [context, setContext] = useState(myReview['context']);
    const [active, setActive] = useState(myReview['rating']);
    const [msg, setMsg] = useState('Press Save to save');

    useEffect(() => {
        setMsg('Press Save to save');
    }, [context, active])

    const save = () => {
        axios.post('http://localhost:3030/review', {
            user_id: myReview['user_id'],
            product_id: myReview['product_id'],
            context: context,
            rating: active
        })
        .then(res => {
            if(res.data['err']) {
                console.log(res.data['err']);
                return;
            }
            setMsg('Saved');
        })
        .catch(err => console.log(err));
    }

    return (
        <div>
            <h3>You Review</h3>
            <Star max={5} active={active} edit={true} setActive={setActive}/><br/>
            <textarea className="review_input" onChange={(e) => {setContext(e.target.value)}} value={context}/>
            <br/>
            <p>{msg}</p>
            <button className="review_input_save" onClick={save}>Save</button>
        </div>
    )
}

function Reviews(props) {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const productID = props.productID;
    var userid = cookies.get('userid');
    const [review, setReview] = useState('nth');
    const [bought, setBought] = useState('nth');

    useEffect(() => {
        axios.get(`http://localhost:3030/product_review?product_id=${productID}`)
        .then(res => {
            if(res.data['err']) {
                console.log(res.data['err']);
                return;
            }
            setReview(res.data);
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:3030/bought?product_id=${productID}&buyer_id=${userid}`)
        .then(res => {
            if(res.data['err']) {
                console.log(res.data['err']);
                return;
            }
            setBought(res.data['bought'])
        })
        .catch(err => console.log(err))
    }, [])
    
    if(review == 'nth' || bought == 'nth') return <p>Loading...</p>

    const L = Object.keys(review).length;

    var reviewList = [];
    var myReview = {
        'user_id': userid,
        'product_id':productID,
        'context': '',
        'rating': 1
    }
    for(var i=0;i<L;i++) {
        if(review[i]['user_id'] == userid) {
            myReview = review[i];
            continue;
        }
        reviewList.push(<SingleReview userid={review[i]['user_id']} cur={review[i]}/>)
    }
    
    return (
        <div>
            <center>
                {bought ? <UserReview myReview={myReview}/>: <p></p>}
                {L > 0 ? <h3>Others Review</h3> : <h3>No Others Reviews</h3>}
                {reviewList}
            </center>
        </div>
    )

}

export default Reviews;