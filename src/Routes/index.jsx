import { Routes, Route } from 'react-router-dom';
import Layout from '../Pages/Layout';
import Login from '../Pages/Auth/Login'
import Register from '../Pages/Auth/Register'
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';
import Home from '../Pages/WarehouseManagers/Home';
import Create from '../Pages/Suppliers/Create';
import Show from '../Pages/Suppliers/Show';
import ProductCreate from '../Pages/Products/Create';
import ViewProducts from '../Pages/Products/Show';


export default function AppRoutes() {
  const { user } = useContext(AppContext);
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      
      <Route element={<Layout />}>
        <Route path="/suppliers" element={<Create/>} />
        <Route path="/suppliers/show" element={<Show/>} />
        <Route path="/products" element={<ProductCreate/>} />
        <Route path="/products/show" element={<ViewProducts/>} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/warehouse-manager" element={<Home/>} />
      </Route>

    </Routes>
  );
}