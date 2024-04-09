import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie'


function HomeHeader() {

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
      
    
      const GotoProfile = () =>{
        setprofile(userid); 
      }
      useEffect(() => {
          if(!profile) return;
          navigate(`/profile/${profile}`);
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

      useEffect(() => {
        if(!gotoHome) return;
        navigate('/home')
      }, [gotoHome])
    
    return (
    <nav className='header'>
        <div className='clearfix'>
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
                <button onClick={GotoSell}>Sell History</button>
                </li>
                <li>
                  <button>History</button>
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

export default HomeHeader