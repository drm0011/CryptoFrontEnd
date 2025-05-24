import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Market from "./pages/Market";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/portfolio" element={<MainLayout><Portfolio /></MainLayout>} />
        <Route path="/market" element={<MainLayout><Market /></MainLayout>} />
        <Route path="/login" element={<MainLayout> <Login /> </MainLayout>} />
        <Route path="/register" element={<MainLayout> <Register /> </MainLayout> } />
      </Routes>
    </Router>
  );
}

export default App;