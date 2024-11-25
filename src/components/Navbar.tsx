import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LuShoppingCart } from 'react-icons/lu';
import { FiHeart } from 'react-icons/fi';
import { FaAngleDown } from 'react-icons/fa6';
import { RxHamburgerMenu } from 'react-icons/rx';
import Profile from "../assets/profile.jpg"
function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleProfileMenu, setToggleProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-between w-full h-16 shadow-sm bg-white">
      <RxHamburgerMenu
        title="hamburger"
        size="24"
        color="#424856"
        className="lg:hidden ml-4 cursor-pointer"
        onClick={() => setToggleMenu(!toggleMenu)}
      />
      
      <div className="flex items-center gap-2 md:ml-8">
        {/* <img src="/logo.png" alt="logo" className="h-8 w-8" /> */}
        <h2 className="text-textBlack font-bold">Kari Shop</h2>
      </div>

      <nav className="hidden lg:flex items-center h-full">
        <Link
          to="/"
          className={`${
            location.pathname === '/' ? 'border-b-2 border-[#1C4A93] text-[#1C4A93]' : 'text-gray-600'
          } h-full flex items-center justify-center px-4`}
        >
          Home
        </Link>
        <Link
          to="/shop"
          className={`${
            location.pathname === '/shop' ? 'border-b-2 border-[#1C4A93] text-[#1C4A93]' : 'text-gray-600'
          } h-full flex items-center justify-center px-4`}
        >
          Shop
        </Link>
        <Link
          to="/about"
          className={`${
            location.pathname === '/about' ? 'border-b-2 border-[#1C4A93] text-[#1C4A93]' : 'text-gray-600'
          } h-full flex items-center justify-center px-4`}
        >
          About Us
        </Link>
        <Link
          to="/contact"
          className={`${
            location.pathname === '/contact' ? 'border-b-2 border-[#1C4A93] text-[#1C4A93]' : 'text-gray-600'
          } h-full flex items-center justify-center px-4`}
        >
          Contact
        </Link>
        <Link
          to="/login"
          className={`${
            location.pathname === '/login' ? 'border-b-2 border-[#1C4A93] text-[#1C4A93]' : 'text-gray-600'
          } h-full flex items-center justify-center px-4`}
        >
          Login
        </Link>
      </nav>

      <div className="flex items-center gap-6 mr-8">
        <div className="flex items-center gap-4">
          <Link className="relative" to="/cart">
            <LuShoppingCart size="22" color="#424856" title="cart" />
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white absolute right-[-0.3rem] top-[-0.2rem] text-xs">
              0
            </div>
          </Link>
          <FiHeart
            color="#424856"
            size="22"
            title="wishlist"
            className="cursor-pointer"
            onClick={() => navigate('/wishlist')}
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 cursor-pointer" onClick={() => setToggleProfileMenu(!toggleProfileMenu)}>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={Profile}
              className="w-full h-full object-cover"
              alt="profile"
            />
          </div>
          <h2 className="text-textBlack">Joanna</h2>
          <FaAngleDown size="16" color="#424856" />
        </div>
      </div>

      {toggleMenu && (
        <div className="bg-white absolute z-20 top-16 left-0 flex flex-col items-start p-4 w-full text-gray-700 shadow-md border-b border-gray-200">
          <Link to="/" className="py-2" onClick={() => setToggleMenu(false)}>Home</Link>
          <Link to="/shop" className="py-2" onClick={() => setToggleMenu(false)}>Shop</Link>
          <Link to="/about" className="py-2" onClick={() => setToggleMenu(false)}>About</Link>
          <Link to="/contact" className="py-2" onClick={() => setToggleMenu(false)}>Contact</Link>
        </div>
      )}

      {toggleProfileMenu && (
        <div className="bg-white absolute z-20 top-16 right-0 flex flex-col items-start w-52 text-gray-700 shadow-md border-b border-l border-gray-200 py-4">
          <Link to="/profile" className="py-2 px-4" onClick={() => setToggleProfileMenu(false)}>Edit Profile</Link>
          <Link to="/settings" className="py-2 px-4" onClick={() => setToggleProfileMenu(false)}>Preferences</Link>
          <button
            type="button"
            className="py-2 px-4 text-left text-red-600 w-full"
            onClick={() => {
              setToggleProfileMenu(false);
              // Handle logout logic here
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
