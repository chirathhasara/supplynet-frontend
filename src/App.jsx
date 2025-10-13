import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'

import { useContext } from 'react';
import { AppContext } from './Context/AppContext';
import AppRoutes from './Routes';



export default function App() {
 
const { user } = useContext(AppContext);

  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  )
}

