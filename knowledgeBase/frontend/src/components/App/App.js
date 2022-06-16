import React from 'react';
import './App.css';
import Nav from '../Nav/Nav';
import Home from '../Home/Home';
import Create from '../Create/Create';
import ManageTags from '../ManageTags/ManageTags';
import Login from '../Login/Login';
import PrivateRoute from '../../utils/PrivateRoute';

import { AuthProvider } from '../../context/AuthContext';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

const App = () => {
  return (
    <div id="site-wrapper">
      <Nav />
      <div id='site-body' className=''>
        <Router>
          <Routes>
            <Route path='/' element={<AuthProvider><PrivateRoute><Home /></PrivateRoute></AuthProvider>} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Create' element={<Create />} />
            <Route path='/ManageTags' element={<ManageTags />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
