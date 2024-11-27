import { useState,useEffect } from 'react';
import { FaBell, FaAngleDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HSButton from '../../form/HSButton';
import Profile from '../../../assets/profile.jpg'
import { logout } from "../../../Redux/Slices/LoginSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
function AdminDashBoardNav() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.loginIn.user);
  const [toggleProfileMenu, setToggleProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleProfileMenuToggle = () => {
    setToggleProfileMenu(!toggleProfileMenu);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleProfileMenuToggle();
    }
  };

  useEffect(() => {}, [dispatch]);


  return (
    <div className="relative flex items-center justify-between w-full h-16 shadow-sm px-5">
      <div className="lg:hidden ml-8"></div>
      <div className="flex items-center gap-2">
        <h2 className="text-black font-bold">Kari-shop</h2>
        <h2 className="text-black font-extrabold hidden lg:block ml-20">
          Dashboard
        </h2>
      </div>
      {user ? (
      <div className="flex items-center gap-1 sm:gap-8 mr-4 ">
        <div className="relative">
          <FaBell size="20" color="#424856" title="notifications" />
          <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red text-white flex items-center justify-center text-xs">
            1
          </div>
        </div>
          <div
            className="flex items-center gap-1 sm:gap-2 cursor-pointer"
            onClick={handleProfileMenuToggle}
            onKeyPress={handleKeyPress}
            role="button"
            tabIndex={0}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
                src={user.profile_picture ?? Profile}
                className="w-full h-full object-cover"
                alt="profile"
              />
            </div>
            <div className="flex flex-col items-start">
              <h2 className="text-black text-sm hidden lg:block">{`${user.firstName} ${user.lastName}`}</h2>
              {/* <span className="text-grey text-xs">{user.role}</span> */}
            </div>
            <FaAngleDown size="15" color="#424856" title="toggleProfile" />
          </div>
      </div>
          ) : (
            <HSButton path="/login" title="Login" styles="xs:hidden lg:flex" />
          )}
      {toggleProfileMenu && (
        <div className="bg-white absolute z-20 top-16 right-0 flex flex-col items-center w-52 shadow-sm py-2 text-grey rounded-b-md border-l border-b border-[#ccc]">
          <div className="flex flex-col w-full gap-2 border-b-[1.5px] border-lightGrey py-2">
            <div className="flex gap-2 w-full items-center px-2">
              {/* <img src="/edit.png" width="20" height="20" alt="edit" /> */}
              <h2>Edit profile</h2>
            </div>
            <div className="flex gap-2 w-full items-center px-2">
              {/* <img src="/settings.png" width="20" height="20" alt="settings" /> */}
              <h2>Preferences</h2>
            </div>
          </div>
          <div className="flex items-center w-full justify-between pr-2 py-2 border-b-[1.5px] border-lightGrey">
            <div className="flex gap-2 items-center px-2">
              {/* <img src="/moon.png" width="20" height="20" alt="moon" /> */}
              <h2>Night mode</h2>
            </div>
            <div className="rounded-xl w-9 h-5 bg-custom-purple flex items-center justify-end px-1">
              <div className="bg-white rounded-full w-3 h-3" />
            </div>
          </div>
          <div className="flex gap-2 w-full items-center px-2 pt-1">
            {/* <img src="/help.png" width="20" height="20" alt="help" /> */}
            <h2>Help center</h2>
          </div>
          <button
            type="button"
            className="border-none outline-none bg-transparent flex gap-2 w-full items-center px-2 border-t-[1.5px] border-lightGrey pt-1 mt-8 cursor-pointer"
            onClick={() => {
              setToggleProfileMenu(false);
              if (user) {
                dispatch(logout());
              } else {
                navigate("/login");
              }
            }}
          >
            {/* <img src="/signout.png" width="20" height="20" alt="signout" /> */}
            {user ? "Sign out" : "Sign in"}
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminDashBoardNav;
