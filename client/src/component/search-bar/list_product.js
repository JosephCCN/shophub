import { useState } from "react";

function ListProduct(props) {
    const [search_key, setSearchKey] = useState();
    console.log(props.products);
    const products = props.products;
    let print_out = [];
    for(var i in products) {
        print_out.push(
            <p>{i}:{products[i]}</p>
        );
    }
    return (
        <div>
            {print_out}
        </div>
    )
}

export default ListProduct;