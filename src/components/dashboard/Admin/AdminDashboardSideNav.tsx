import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { MdAnalytics, MdDashboard, MdNotifications } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { FiShoppingCart, FiSettings, FiTrendingUp } from 'react-icons/fi';
import { ChevronDown, ChevronRight, Package } from 'lucide-react';

const sideBarItems = [
  {
    path: '/admin',
    name: 'Dashboard',
    icon: <MdDashboard className="icon" />,
  },
  {
    name: 'User',
    icon: <FaUser className="icon" />,
    subItems: [
      { path: '/admin/users/all', name: 'All Users' },
      { path: '/admin/users/roles', name: 'Manage Roles' },
    ],
  },
  {
    name: 'Shop',
    icon: <FiShoppingCart className="icon" />,
    subItems: [
      { path: '/admin/shops/approval', name: 'Approve Shops' },
    ],
  },
  {
    name: 'Category',
    icon: <Package className="icon" />,
    subItems: [
      { path: '/admin/category/all', name: 'Manage Categories' },
      { path: '/admin/category/add', name: 'Create Category' },
    ],
  },
  {
    name: 'Order',
    icon: <FiShoppingCart className="icon" />,
    subItems: [
      { path: '/admin/orders/manage', name: 'Manage Orders' },
      { path: '/admin/orders/details', name: 'Order Details' },
    ],
  },
  {
    name: 'Transaction',
    icon: <FiTrendingUp className="icon" />,
    subItems: [
      { path: '/admin/transactions/summary', name: 'Transaction Summary' },
      { path: '/admin/transactions/history', name: 'Transaction History' },
    ],
  },
  {
    name: 'Settings',
    icon: <FiSettings className="icon" />,
    subItems: [
      { path: '/admin/settings/seo', name: 'SEO Metadata' },
      { path: '/admin/settings/policies', name: 'Policies & Terms' },
    ],
  },
  {
    name: 'Analytics',
    icon: <MdAnalytics className="icon" />,
    subItems: [
      { path: '/admin/analytics/sales', name: 'Sales Analytics' },
      { path: '/admin/analytics/user-activity', name: 'User Activity' },
    ],
  },
  {
    name: 'Notifications',
    icon: <MdNotifications className="icon" />,
    subItems: [
      { path: '/admin/notifications/manage', name: 'Manage Notifications' },
      { path: '/admin/notifications/unread', name: 'Unread Notifications' },
    ],
  }
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
              className="px-2 py-1 hover:text-white hover:bg-[#1C4A93] w-full rounded-sm transition-all duration-300 ease-in-out"
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

function AdminDashboardSideNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('Dashboard Overview');

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
        className={`h-screen bg-white fixed left-0 z-40 ${isVisible ? 'block' : 'hidden'} lg:block w-[220px]`} 
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

export default AdminDashboardSideNav;
