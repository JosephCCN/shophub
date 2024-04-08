import { useEffect, useState } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import LoadProductPhoto, { LoadProduct } from "../util/product";

function Payment() {
    const { userid } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [notEnough, setNotEnough] = useState('nth');
    const [home, setHome] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3030/pay?userid=${userid}`)
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
        if(home) {
            navigate('/home');
        }
    }, [home])

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

    const Home = () => {
        setHome(true);
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
        var list = []
        for(var i=0;i<notEnough.length;i++) {
            list.push(
                <div>
                    <LoadProductPhoto productid={notEnough[i]}/>
                    <LoadProduct productid={notEnough[i]} entities={['product_name']} prefix={[]}/>
                </div>
        )
        }
        return (
            <div>
                <button onClick={Home}>Home</button>
                <h2>These products do not have enough stock</h2>
                <h3>Other products are on the way to your home</h3>
                {list}
            </div>
        )
    }
    
}

export default Payment;