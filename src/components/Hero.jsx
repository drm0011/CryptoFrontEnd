import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="hero" className="bg-white text-black py-10">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center px-6">
        {/* Text Content */}
        <div className="flex flex-col space-y-8 text-center lg:text-left lg:w-1/2">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Crypto insights without the noise.
          </h1>
          <p className="text-lg lg:text-xl text-gray-500">
            Track your portfolio and stay informed without the hype. All signal, no noise.
          </p>
          <div>
            <Link
              to="/portfolio"
              className="inline-block px-8 py-4 bg-green-600 text-white font-semibold text-lg rounded hover:opacity-80"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Placeholder Image */}
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
          <img
            src="https://via.placeholder.com/500x350.png?text=Crypto+Dashboard"
            alt="Crypto dashboard preview"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
