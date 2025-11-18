import { Routes, Route } from 'react-router-dom';
import Layout from '../Pages/Layout';
import Login from '../Pages/Auth/Login'
import Register from '../Pages/Auth/Register'
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';
import Home from '../Pages/WarehouseManagers/Home';
import Create from '../Pages/Suppliers/Create';
import RawMaterialsCreate from '../Pages/RawMaterials/Create';
import RawMaterialsShow from '../Pages/RawMaterials/Show';
import CreatePurchaseOrder from '../Pages/PurchaseOrders/Create';
import ViewPurchaseOrder from '../Pages/PurchaseOrders/Show'
import Show from '../Pages/Suppliers/Show';
import ProductCreate from '../Pages/Products/Create';
import ViewProducts from '../Pages/Products/Show';
import ProductOrders from '../Pages/BranchStorekeepers/ProductOrders';
import ReceivedProductOrders from '../Pages/WarehouseStorekeepers/ReceivedProductOrders';
import Delivery from '../Pages/WarehouseStorekeepers/Delivery';
import ReceivedProducts from '../Pages/BranchStorekeepers/ReceivedProducts';
import AcceptOrder from '../Pages/BranchStorekeepers/AcceptOrder';
import LocalStock from '../Pages/BranchStorekeepers/LocalStock';
import ReceivedPurchaseOrder from '../Pages/PurchaseOrders/ReceivedPurchaseOrder';
import DeliveryView from '../Pages/WarehouseStorekeepers/DeliveryView';
import PurchaseOrderStat from '../Pages/TopManagement/PurchaseOrderStat';


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
        <Route path="/products/orders" element={<ProductOrders/>} />
        <Route path="/products/orders/view" element={<ReceivedProductOrders/>} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/delivery/view" element={<DeliveryView />} />
        <Route path="/delivery/received" element={<ReceivedProducts />} />
        <Route path="/delivery/accept" element={<AcceptOrder />} />
        <Route path="/local/stock" element={<LocalStock/>} />
        <Route path="/rawmaterials/submit" element={<RawMaterialsCreate />} />
        <Route path="/rawmaterials/show" element={<RawMaterialsShow />} />
        <Route path="/purchase-order/create" element={<CreatePurchaseOrder />} />
        <Route path="/purchase-order/view" element={<ViewPurchaseOrder />} />
        <Route path="/purchase-order/received" element={<ReceivedPurchaseOrder />} />
        
      </Route>

      <Route path="/purchase-order/stat" element={<PurchaseOrderStat />} />

      <Route element={<Layout />}>
        <Route path="/warehouse-manager" element={<Home/>} />
      </Route>

    </Routes>
  );
}