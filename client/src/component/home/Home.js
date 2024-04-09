// Importing Link from react-router-dom to 
// navigate to different end points.
import './css/Home.css';
import './css/notice.css';
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'
import Bar from '../search-bar/bar'
import ListProduct from "../search-bar/list_product";
import Recommendation from '../recommendation/recommendation';
import ShowNotification from '../wishlist/notification';
import AdvanceBar from '../search-bar/advance_bar';
import PageHeader from '../util/miss';

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
      <PageHeader/>
      <div className='searching'>
        <table>
          <tr>
            <td><h1>Home Page</h1></td>
            <td className="ad_search"><input type="checkbox" checked={advance} onChange={handleAdvance}/> advance</td>
            <td>
            {advance ? <AdvanceBar setSearched={setSearched} setProductInfo={setProductInfo}/>: <Bar setSearched={setSearched} setProductInfo={setProductInfo}/>}
            </td>
          </tr>
        </table>
      </div>
      <div className='notice'>
        <p>Notification</p>
        <ShowNotification userid={userid}/>
      </div>
      {searched ? <ListProduct products={product_info}/> : <Recommendation userid={userid}/>}
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
