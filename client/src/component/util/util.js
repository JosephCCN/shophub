import { useState, useEffect } from "react";
import axios from 'axios'

export function Get(url) {
    const [data, setData] = useState();
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        const fetch = async () =>{
            const result = await axios.get(url);
            setData(result.data);
            setLoading(false);
        }
        fetch();
    }, []);
    return {
        data,
        isLoading
    }
}

export function Post(url) {
    const [data, setData] = useState();
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        const fetch = async () =>{
            const result = await axios.post(url);
            setData(result.data);
            setLoading(false);
        }
        fetch();
    }, []);
    return {
        data,
        isLoading
    }
}

export function GetUserName(id) {
    const {data, isLoading} = Get(`http://localhost:3030/username?id=${id}`);
    if(isLoading) return 'loading...'
    else return data[0]['username']
}

export function GetProduct(id) {
    const {data, isLoading} = Get(`http://localhost:3030/product?id=${id}`);
    if(isLoading) return 'loading...';
    else return data[0];
}