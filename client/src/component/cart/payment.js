import { useEffect, useState } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import ListProduct from "../search-bar/list_product";
import PageHeader from "../util/miss";
import '../util/css/back.css'

function Payment() {
    const { userid } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [notEnough, setNotEnough] = useState('nth');
    const [back, setBack] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/pay?userid=${userid}`)
        .then(res => {
            if(res.data['err']) {
                console.log(res.data['err'])
                return;
            }
            else if(res.data['not_enough']) {
                setNotEnough(res.data['not_enough']);
            }
            setLoading(false);
        })
        .catch(err => console.log(err));
    }, [])

    useEffect(() => {
        if(back) {
            navigate(-1);
        }
    }, [back])

    if(isLoading) return <p>You payment is on the way</p>

    const delay = (ms) => {
        return new Promise(
          resolve => setTimeout(resolve, ms)
        );
      }

    const back_home = async() => {
        await delay(1500);
        navigate('/home');
    }

    const Back = () => {
        setBack(true);
    }

    if(notEnough == 'nth') {
        back_home();

        return (
            <div>
                <h2>Orders are on the way to your home!</h2>
                <p>Redirecting to Home...</p>
            </div>
        )
    }
    else {
        return (
            <div>
                <PageHeader/>
                <h2>These products do not have enough stock</h2>
                <h3>Other products are on the way to your home</h3>
                <ListProduct products={notEnough}/>
            </div>
        )
    }
    
}

export default Payment;