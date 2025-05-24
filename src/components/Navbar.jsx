import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/cryptologo2.webp";
import "../Navbar.css"; 

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-2 shadow-sm">
      <div className="d-flex align-items-center">
        <Link className="navbar-brand me-4" to="/">
          <img
            src={logo}
            alt="CryptoTracker Logo"
            className="navbar-logo"
          />
        </Link>
      </div>

      <div className="navbar-nav ms-auto align-items-center">
        <Link className="nav-link" to="/portfolio">Portfolio</Link>
        <Link className="nav-link" to="/market">Market</Link>

        {!token ? (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">
              <button className="btn btn-success ms-2">Signup</button>
            </Link>
          </>
        ) : (
          <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
