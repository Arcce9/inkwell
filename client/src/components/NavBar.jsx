// client/src/components/NavBar.jsx
//
// Base (unprefixed) classes target mobile first (Section 4.5).
// md: and lg: prefixes layer on enhancements for larger viewports —
// never the reverse.
import { NavLink } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="font-bold text-lg text-gray-900">Inkwell</div>
      
      <div className="flex items-center space-x-6">
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `text-sm transition-colors ${
              isActive ? "font-semibold text-indigo-600" : "text-gray-600 hover:text-gray-900"
            }`
          }
        >
          Feed
        </NavLink>
        
        <NavLink
          to="/write"
          className={({ isActive }) =>
            `text-sm transition-colors ${
              isActive ? "font-semibold text-indigo-600" : "text-gray-600 hover:text-gray-900"
            }`
          }
        >
          Write
        </NavLink>
      </div>
    </nav>
  );
}