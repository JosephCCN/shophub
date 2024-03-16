import './App.css';
import Login from './component/auth/login'
//import Registration from './component/auth/register'
import Home from './component/home/Home'
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom'


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home"/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
