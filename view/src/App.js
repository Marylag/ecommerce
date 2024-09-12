import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import GoogleLoginRedirect from './pages/Login/GoogleLoginRedirect';
import Navbar from './components/Navigation/Navbar';
import ProductDetails from './pages/Products/ProductDetails';
import Cart from './pages/Cart/Cart';
import OrderHistory from './pages/Orders/OrderHistory';
import ProductList from './pages/Products/ProductList';
import Footer from './components/Footer/Footer';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<GoogleLoginRedirect />} />
          <Route path="/products" element={<ProductList />} />
          <Route path='/products/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/orders' element={<OrderHistory />} />
        </Routes>
        <Contact />
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
