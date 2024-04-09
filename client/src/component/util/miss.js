import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie'
import './css/Header.css';
import HomeLogo from "./css/home_icon2.jpg"
import Bar from "../search-bar/bar";
import AdvanceBar from "../search-bar/advance_bar";


function PageHeader() {

    const cookies = new Cookies();

    const userid = cookies.get('userid');
    const navigate = useNavigate();

    const [logOut, setLogout] = useState(0);
    var [gotoSell, setGoToSell] = useState(0);
    var [profile, setprofile] = useState(0);
    var [gotoCart, setGoToCart] = useState(0);
    var [gotoWishlist, setgotoWishlist] = useState(0);
    var [gotoAdmin, setgotoAdmin] = useState(0);
    var [gotoHome, setGotoHome] = useState(0);

    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
      if(cookies.get('admin')) {
        setAdmin(true);
      }
    }, [])


    const logout = () => {
        setLogout(1);
      };
      useEffect(() => {
        if(!logOut) return
        cookies.remove('userid', {
          path: '/'
        });
        cookies.remove('admin', {
          path: '/'
        });
        navigate('/login');
      }, [logOut])
    
      
    
    const GotoSell = () => {
        setGoToSell(1);
      }
      useEffect(() => {
          if(!gotoSell) return;
          gotoSell = 0;
          navigate('/seller');
      }, [gotoSell])
      
      useEffect(() => {
          if(!profile) return;
          navigate(`/profile/${userid}`);
      }, [profile])
    
      const GotoCart = () => {
        setGoToCart(1);
      }
      useEffect(() => {
        if(!gotoCart) return;
        gotoCart = 0;
        navigate('/cart');
      }, [gotoCart])
    
    
      const GotoWishlist = () => {
        setgotoWishlist(1);
      }
      useEffect(() => {
          if(!gotoWishlist) return;
          navigate(`/wishlist`)
      }, [gotoWishlist])

      const GotoAdmin = () => {
        setgotoAdmin(1);
      }
      useEffect(() => {
        if(!gotoAdmin) return;
        navigate('/admin')
      }, [gotoAdmin])

      const GotoHome = () => {
        setGotoHome(1);
      }
      useEffect(() => {
        if(!gotoHome) return;
        navigate('/home')
      }, [gotoHome])
    
    return (
    <nav className='header'>
        <div className='clearfix'>
            <img src={HomeLogo} alt = "Logo" className='img' onClick={GotoHome}/>
            <div className='hometopright'>
              <ul>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
                <li>
                  <button onClick={GotoWishlist}>Wishlist</button>
                </li>
                <li>
                  <button onClick={GotoCart}>Shopping Cart</button>
                </li>
                <li>
                <button onClick={GotoSell}>Seller</button>
                </li>
                <li>
                  <button onClick={() => {setprofile(true)}}>Profile</button>
                </li>
                <li>
                  
                </li>
                {isAdmin ? <li><button onClick={GotoAdmin}>Admin Page</button></li> : <></>}
                <li>
                  <button onClick={() => {setGotoHome(true)}}>Home Page</button>
                </li>
              </ul>
          </div>   
        </div>
      </nav>
    )
}

export function SearchBar(props) {
  const [advance, setAdvance] = useState(props.advance);

  const handleAdvance = () => {
    if(advance) setAdvance(false);
    else setAdvance(true);
  }

  return (
    <div className='searching'>
        <table>
          <tr>
            <td><h1>Home Page</h1></td>
            <td className="ad_search"><input type="checkbox" checked={advance} onChange={handleAdvance}/> advance</td>
            <td>
            {advance ? <AdvanceBar/>: <Bar/>}
            </td> 
          </tr>
        </table>
      </div>
  )
}

export default PageHeader;