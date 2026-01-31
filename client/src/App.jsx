import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';

import RequireAuth from './routes/RequireAuth';
import RequireGuest from './routes/RequireGuest';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import OrderDetails from './pages/OrderDetails';
import RecipeDetails from './pages/RecipeDetails';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route element={<AppLayout />}>
          {/* PUBLIC */}
          <Route path='/' element={<Home />} />
          <Route path='/recipe/:recipeId' element={<RecipeDetails />} />

         {/* GUEST ONLY */}
          <Route element={<RequireGuest />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>

          {/* AUTH ONLY */}
          <Route element={<RequireAuth />}>
            <Route path='/cart' element={<Cart />} />
            <Route path='/order/:orderId' element={<OrderDetails />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;