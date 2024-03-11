import { Route } from "react-router-dom";
import Login from './login'

function Home() {
  return (
    <div>
        <Routes>
            <Route path='/login' element={<Login/>}>
            </Route>
        </Routes>
    </div>
  );
}

export default Home;
