import { Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthUser(null);
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Shield className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              LegalEase
            </span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Upload
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {!authUser ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Circle */}
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer select-none"
                >
                  {getInitials(authUser.username)}
                </div>

                {/* Animated Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 p-4 transform transition-all duration-200 ${
                    dropdownOpen
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 -translate-y-2 invisible"
                  }`}
                >
                  <p className="font-semibold">{authUser.username}</p>
                  <p className="text-gray-500 text-sm">{authUser.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-3 flex items-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
