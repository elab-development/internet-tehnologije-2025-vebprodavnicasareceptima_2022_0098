import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
        <Route path='/' element={<Home />} />
        <Route path='/recipe/:recipeId' element={<RecipeDetails />} />

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route path='/cart' element={<Cart />} />
        <Route path='/order/:orderId' element={<OrderDetails />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;