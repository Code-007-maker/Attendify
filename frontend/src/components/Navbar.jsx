import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { DropdownMenuDemo } from "./dropdown"; 
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/5 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
       
        <Link to="/" className="text-2xl font-bold text-white hover:text-purple-300 transition">
          Attendify
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;


