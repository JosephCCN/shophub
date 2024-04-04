import axios from 'axios'
import { useEffect, useState } from 'react';

function LoadProductPhoto(prop){ //load photo from backend server
    const [isLoading, setLoading] = useState(true);
    const productid = prop.productid;
    const [img, setImg] = useState('');

    const select = (e) => {
        console.log('clicked')
    }

    useEffect(() => {
        const fetch_image = async() => {
            try{
                const res = await axios.get(`http://localhost:3030/product_img?id=${productid}`, {responseType: 'blob'})
                var imageUrl = URL.createObjectURL(res.data);
                setImg(imageUrl);
                setLoading(false);
            }
            catch(err){
                console.log(err);
                return;
            }
        }
        fetch_image();
    }, [])
    if(isLoading) return <p>Loading...</p> ;
    return (
        <div onClick={select} style={{cursor:'pointer'}}>
            <img src={img}/>
        </div>
    )
}

export default LoadProductPhoto;