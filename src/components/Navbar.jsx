import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();          
    navigate("/");     
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 mb-4">
      <Link className="navbar-brand" to="/">Home</Link>

      <div className="navbar-nav">
        <Link className="nav-link" to="/portfolio">Portfolio</Link>
        <Link className="nav-link" to="/market">Market</Link>

        {!token ? (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        ) : (
          <button
            className="btn btn-outline-danger ms-3"
            onClick={handleLogout} 
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
