import React from 'react';
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-screen-md mx-auto text-center">
        <div className="flex justify-center space-x-6 mt-2">
          <a
            href="https://github.com/leerichi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition"
            >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/leerichchi/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition"
            >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://leechi.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition"
            >
            <FaGlobe size={24} />
          </a>
        </div>
        <p className='mt-5'>&copy; 2025 Pokédex. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
