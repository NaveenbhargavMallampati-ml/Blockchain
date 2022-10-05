import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import HomePage from './app/pages/Home';
import Navbar from './app/components/Header';
import Fetch from './app/Fetch';
import Cart from './app/pages/popup';
import Header from './app/components/Header';
import Footer from './app/components/Footer';
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import Cart1 from './app/components/Cart1';
import { useMediaQuery } from 'react-responsive'

function App() {

  const isMobileDevice = useMediaQuery({
    query: "(min-device-width: 480px)",
  });

  const isTabletDevice = useMediaQuery({
    query: "(min-device-width: 768px)",
  });

  const isLaptop = useMediaQuery({
    query: "(min-device-width: 1024px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1200px)",
  });

  const isBigScreen = useMediaQuery({
    query: "(min-device-width: 1201px )",
  });


  return (
    <div>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Fetch></Fetch>}/>
          <Route path="/Cart1" element={<Cart1></Cart1>}/>
        </Routes>
      </BrowserRouter>

      <Footer/>
    </div>
  );
}

export default App;
