import { Routes, Route } from 'react-router-dom';
import OutletHeader from '../components/OutletHeader';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import CreateAccount from '../pages/CreateAccount';
import Cart from '../pages/Cart';
import PlaceOrder from '../pages/PlaceOrder';
import OrderSuccess from '../pages/OrderSuccess';
import Orders from '../pages/Orders';

export function App() {
  return (
    <div className="">
      <OutletHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
}

export default App;
