// Importing Link from react-router-dom to 
// navigate to different end points.
import { Link } from "react-router-dom";
 
const Home = () => {
    return (
      <div>
        <h1>Home Page</h1>
        <Link to='/login'>Login</Link>
      </div>
    );
};
 
export default Home;
