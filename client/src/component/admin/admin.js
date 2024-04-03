// Importing Link from react-router-dom to 
// navigate to different end points.
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'

function Admin(){

  const cookies = new Cookies();
  const userid = cookies.get('userid');
  if(!userid) {
    return (<Navigate to='/login'/>);
  }
  else {
    return(<Actual_home/>);
  }
};
 
export default Admin;
