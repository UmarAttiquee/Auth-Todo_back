import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo / Brand */}
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-amber-400">MyApp</h1>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-6 text-sm">
            <li>
              <a href="/home" className="hover:text-amber-400 transition-colors">Home</a>
            </li>
            <li>
              <a href="/about" className="hover:text-amber-400 transition-colors">About</a>
            </li>
            <li>
              <a href="/login" className="hover:text-amber-400 transition-colors">Login</a>
            </li>
            <li>
              <a href="/register" className="hover:text-amber-400 transition-colors">Register</a>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">
              <FaGithub size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">
              <FaLinkedin size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
