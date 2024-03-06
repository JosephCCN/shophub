import './Home.css';
// Importing Link from react-router-dom to 
// navigate to different end points.
import { Link } from "react-router-dom";
 
const Home = () => {
    return (
      <div>
        <h1>Home Page</h1>
        <br />
        <ul>
          <li>
            {/* Endpoint to route to Home component */}
            <Link to="/">Home</Link>
          </li>
          <li>
            {/* Endpoint to route to About component */}
            <Link to="/test">Test</Link>
          </li>
        </ul>
      </div>
    );
};
 
export default Home;
