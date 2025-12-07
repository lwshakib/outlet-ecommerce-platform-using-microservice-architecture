import { Routes, Route } from 'react-router-dom';
import OutletHeader from '../components/OutletHeader';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import CreateAccount from '../pages/CreateAccount';

export function App() {
  return (
    <div className="">
      <OutletHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </div>
  );
}

export default App;
