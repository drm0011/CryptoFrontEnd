import { Link } from "react-router-dom";
import phoneImage from "../assets/phoneimage.webp";
import "../Hero.css"; 

const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        
        {/* Left Side: Text */}
        <div className="hero-text">
          <h1>Crypto insights without the noise.</h1>
          <p>
            Track your portfolio and stay informed without the hype. All signal, no noise.
          </p>
          <Link to="/login" className="hero-button">
            Get Started
          </Link>
        </div>

        {/* Right Side: Image */}
        <div className="hero-image">
          <img src={phoneImage} alt="Crypto dashboard preview" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
