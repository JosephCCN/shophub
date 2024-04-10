// Importing Link from react-router-dom to 
// navigate to different end points.
import './css/Home.css';
import './css/notice.css';
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'
import Recommendation from '../recommendation/recommendation';
import ShowNotification from '../wishlist/notification';
import PageHeader from '../util/miss';
import { SearchBar } from '../util/search';

function Actual_home() {
  const cookies = new Cookies();
  const userid = cookies.get('userid');

  return (
    <body>
        <PageHeader/>
        <SearchBar/>
        <Recommendation userid={userid}/>
        <div className='notice'>
          <p>Notification</p>
          <ShowNotification userid={userid}/>
        </div>  
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
