// Importing Link from react-router-dom to 
// navigate to different end points.
import './css/Home.css';
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'
import Bar from '../search-bar/bar'
import ListProduct from "../search-bar/list_product";
import Recommendation from '../recommendation/recommendation';
import ShowNotification from '../wishlist/notification';
import AdvanceBar from '../search-bar/advance_bar';
import HomeHeader from '../util/miss';

function Actual_home() {
  const [product_info, setProductInfo] = useState({});
  const [searched, setSearched] = useState(false);
  const cookies = new Cookies();
  const userid = cookies.get('userid');

  const [advance, setAdvance] = useState(false);

  const handleAdvance = () => {
    if(advance) setAdvance(false);
    else setAdvance(true);
  }

  return (
    <body>
      <HomeHeader/>
      <div className='searching'>
        <table>
          <tr>
            <td>
            {advance ? <AdvanceBar setSearched={setSearched} setProductInfo={setProductInfo}/>: <Bar setSearched={setSearched} setProductInfo={setProductInfo}/>}
            </td>
            <td><input type="checkbox" checked={advance} onChange={handleAdvance}/> advance</td>
          </tr>
        </table>
      </div>
        {searched ? <ListProduct products={product_info}/> : <Recommendation userid={userid}/>}
        <ShowNotification userid={userid}/>
      
    </body>
  )
}

function Home(){

  const cookies = new Cookies();
  const userid = cookies.get('userid');
  if(!userid) {
    return (<Navigate to='/login'/>);
  }
  else {
    return(<Actual_home/>);
  }
};
 
export default Home;
