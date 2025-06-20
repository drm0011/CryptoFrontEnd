import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Market from "./pages/Market";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MainLayout from "./layout/MainLayout";
import CoinDetail from "./pages/CoinDetail"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
        <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/portfolio" element={<MainLayout><Portfolio /></MainLayout>} />
        <Route path="/market" element={<MainLayout><Market /></MainLayout>} />
        <Route path="/login" element={<MainLayout> <Login /> </MainLayout>} />
        <Route path="/register" element={<MainLayout> <Register /> </MainLayout> } />
        <Route path="/coin/:id" element={<MainLayout><CoinDetail /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;