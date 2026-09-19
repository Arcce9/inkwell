// client/src/components/NavBar.jsx

import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Inkwell
        </Link>
        <div className="flex items-center space-x-4">
          <Link 
            to="/write" 
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Write
          </Link>
          <Link 
            to="/login" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
}