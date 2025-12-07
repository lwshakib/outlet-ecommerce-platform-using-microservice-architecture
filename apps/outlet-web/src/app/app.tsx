import { Routes, Route } from 'react-router-dom';
import OutletHeader from '../components/OutletHeader';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import CreateAccount from '../pages/CreateAccount';
import Cart from '../pages/Cart';
import PlaceOrder from '../pages/PlaceOrder';
import OrderSuccess from '../pages/OrderSuccess';
import Orders from '../pages/Orders';
import ProductDetail from '../pages/ProductDetail';

export function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <OutletHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
