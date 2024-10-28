import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { MdDashboard, MdMusicNote } from 'react-icons/md';
import {  GiBookshelf } from 'react-icons/gi';
import {  FaUser } from 'react-icons/fa';
import { FiShoppingCart, FiSettings } from 'react-icons/fi';
import { ChevronDown, ChevronRight, Package } from 'lucide-react';
import { AiFillProduct } from "react-icons/ai";
import { IoIosAlbums } from "react-icons/io";

const sideBarItems = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: <MdDashboard className="icon" />,
  },
  {
    name: 'Shop',
    icon: <FiShoppingCart className="icon" />,
    subItems: [
      {
        path: '/dashboard/shop/add',
        name: 'Add Shop',
      },
      {
        path: '/dashboard/shop/all',
        name: 'All Shop',
      },
    ],
  },
  {
    name: 'Categories',
    icon: <Package className="icon" />,
    subItems: [
      { path: '/dashboard/category/add', name: 'Add Category' },
      { path: '/dashboard/category/all', name: 'All Categories' },
    ],
  },
  {
    name: 'Books',
    icon: <GiBookshelf className="icon" />,
    subItems: [
      { path: '/dashboard/books/add', name: 'Add Book' },
      { path: '/dashboard/books/All', name: 'All Books' },
    ],
  },
  {
    name: 'Album',
    icon: <IoIosAlbums className="icon" />,
    subItems: [
      { path: '/dashboard/music/album/create', name: 'Create Album' },
      { path: '/dashboard/music/album/all', name: 'All Album' },
    ],
  },
  {
    name: 'Music',
    icon: <MdMusicNote className="icon" />,
    subItems: [
      { path: '/dashboard/music/all', name: 'All Music' },
      { path: '/dashboard/music/create', name: 'Create Music' },
    ],
  },
  {
    name: 'User',
    icon: <FaUser className="icon" />,
    subItems: [
      { path: '/dashboard/user/profile', name: 'Profile' },
    ],
  },
  {
    name: 'Product',
    icon: <AiFillProduct className="icon" />,
    subItems: [
      { path: '/dashboard/product/add', name: 'Add product' },
      { path: '/dashboard/product/all', name: 'All product' },
    ],
  },
  {
    name: 'Order',
    icon: <FiShoppingCart className="icon" />,
    subItems: [
      { path: '/dashboard/orders/all', name: 'All Order' },
    ],
  },
  {
    path: '/settings',
    name: 'Setting',
    icon: <FiSettings className="icon" />,
  },
];

interface SideBarItemProps {
  item: {
    path?: string;
    name: string;
    icon: React.ReactNode;
    subItems?: { path?: string; name: string; icon?: React.ReactNode; subItems?: { path?: string; name: string }[] }[];
  };
  activeItem: string;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
}

function SideBarItem({ item, activeItem, setActiveItem }: SideBarItemProps) {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <li className={`p-3 ${activeItem === item.name ? 'bg-[#1C4A93] text-white' : ''}`}>
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-[#1C4A93] hover:text-white p-2 rounded-md transition-all duration-300 ease-in-out"
        onClick={() => {
          if (item.subItems) {
            handleExpand();
          } else {
            setActiveItem(item.name);
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (item.subItems) {
              handleExpand();
            } else {
              setActiveItem(item.name);
            }
          }
        }}
      >
        <div className="flex items-center gap-3 text-lg ">
          {item.icon}
          <span>{item.name}</span>
        </div>
        {item.subItems &&
          (expanded ? (
            <ChevronDown className="ml-6" />
          ) : (
            <ChevronRight className="ml-6" />
          ))}
      </div>
      {expanded && item.subItems && (
        <ul className="p-2 pl-6 rounded-b-md">
          {item.subItems.map((subItem) => (
            <li
              key={subItem.name}
              className="px-2 py-1 text-black hover:text-white hover:bg-[#1C4A93] w-full rounded-sm transition-all duration-300 ease-in-out"
            >
              <a
                href={subItem.path}
                className="flex items-center gap-3 text-lg"
                onClick={() => setActiveItem(subItem.name)}
              >
                {subItem.icon && subItem.icon}
                <span>{subItem.name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function DashboardSideNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('Dashboard');

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-3 z-50 p-1"
        onClick={toggleSidebar}
        type="button"
        aria-label="Toggle Menu"
      >
        <AiOutlineMenu className="text-2xl" />
      </button>
      <aside
        className={`h-screen bg-white fixed left-0 z-40 ${isVisible ? 'block' : 'hidden'} lg:block`}
      >
        <nav className="h-full flex flex-col justify-between shadow-sm">
          <ul className="flex-1 mt-6 overflow-x-auto pb-[100px]">
            <li className="lg:hidden flex justify-end p-3">
              <button
                onClick={toggleSidebar}
                type="button"
                aria-label="Close Menu"
              >
                <AiOutlineClose className="text-2xl cursor-pointer" />
              </button>
            </li>
            {sideBarItems.map((item) => (
              <SideBarItem
                key={item.name}
                item={item}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default DashboardSideNav;
