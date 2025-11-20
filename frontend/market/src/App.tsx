import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favorites'
import FollowedStores from './pages/FollowedStores'
import BrowsingHistory from './pages/BrowsingHistory'
import StoreDetail from './pages/StoreDetail'
import AllProducts from './pages/AllProducts'
import UserProfile from './pages/UserProfile'
import Orders from './pages/Orders'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="payment" element={<Payment />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="stores" element={<FollowedStores />} />
          <Route path="history" element={<BrowsingHistory />} />
          <Route path="store/:id" element={<StoreDetail />} />
          <Route path="category/:id" element={<AllProducts />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
