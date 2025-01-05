import { Link } from 'react-router-dom';
import { Brainly } from '../icons/Brainly';

function Welcome() {
  return (
    <div className="bg-gray-900 relative overflow-hidden min-h-screen">
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between z-10">
        <ul className="flex space-x-6">
          <li>
            <Link to="/signup" className="bg-[#063970] text-white font-bold py-2 px-4 rounded">
              Sign Up
            </Link>
          </li>
          <li>
            <Link to="/signin" className="bg-[#063970] text-white font-bold py-2 px-4 rounded">
              Sign In
            </Link>
          </li>
        </ul>
        <div className="flex items-center pr-4 hover:cursor-pointer">
          <Brainly />
          <span className="text-white text-4xl font-bold pl-2">Brainly</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 text-center z-10">
        <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">
          Capture Your Ideas, <br /> Organize Your Thoughts
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Brainly is your second brain - a place to store and organize all the interesting tweets and YouTube videos you find.
        </p>
        <Link to="/signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
