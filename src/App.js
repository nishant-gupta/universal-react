import React from "react";
//import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ScrollToTop from "./utils/scrollToTop";
import Home from "./Home";
// import { Link } from "react-router-dom";

import './App.css';

import ArticlePage from './ArticlePage';


function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <Router>
      
      <div className="App">
        {/* <header>
        <Link to={"/"}>
          <img src={logo} className="logo" alt="ExL Logo"/>
        </Link>        
        <hr />
        </header> */}
        <Routes>
          <Route path='/article/:slug' element={<ArticlePage />}/>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </div>
    </Router>

    
  );
}

export default App;
