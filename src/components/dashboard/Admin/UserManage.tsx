/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import { IoIosSearch } from "react-icons/io";

interface User {
  name: string;
  email: string;
  role: string;
  type: string;
  status: string;
}
const BASE_URL= import.meta.env.VITE_BASE_URL;

const UserManage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [users, setUsers] = useState<any>([]);

  
  const fetchAllUsers= async ()=>{
    const response= await axios.get(`${BASE_URL}/user/all-users`)
    const users=response.data.data.users;
    console.log(users);
    setUsers(users);
}
useEffect(()=>{
 fetchAllUsers();
}, [])
  const usersPerPage = 5;
  const totalPages = Math.ceil(users?.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Disabled">("All");
  const [roleFilter, setRoleFilter] = useState<"All" | "Administrator" | "Artist" | "Buyer" | "Seller">("All");

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const toggleUserStatus = (email: string) => {
    setUsers((prevUsers:any) =>
      prevUsers.map((user:any) =>
        user.email === email
          ? {
              ...user,
              status: user.status === "Active" ? "Disabled" : "Active",
            }
          : user
      )
    );
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((user:any) => user.status === 'Active').length;
  const disabledUsers = users.filter((user:any) => user.status === 'Inactive').length;
  const adminUsers = users.filter((user:any) => user.role === 'admin').length;

  const filteredUsers = users.filter((user:any) => {
    return (
      (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || user.status === statusFilter) &&
      (roleFilter === "All" || user.role === roleFilter)
    );
  });

  const currentFilteredUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1C4A93] text-white p-6 rounded-lg shadow items-center flex flex-col">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-green text-white p-6 rounded-lg shadow items-center flex flex-col">
          <h2 className="text-xl font-semibold">Active Users</h2>
          <p className="text-3xl font-bold">{activeUsers}</p>
        </div>
        <div className="bg-red text-white p-6 rounded-lg shadow items-center flex flex-col">
          <h2 className="text-xl font-semibold">Disabled Users</h2>
          <p className="text-3xl font-bold">{disabledUsers}</p>
        </div>
        <div className="bg-[#1C4A93] text-white p-6 rounded-lg shadow items-center flex flex-col">
          <h2 className="text-xl font-semibold">Administrators</h2>
          <p className="text-3xl font-bold">{adminUsers}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button className="bg-[#1C4A93] text-white px-4 py-2 rounded hover:bg-blue-600">
          <i className="fa fa-users"></i> Roles
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg pr-10"
            placeholder="Search User by name, email, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoIosSearch className="absolute text-[25px] right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex space-x-4 ml-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="All">All</option>
            <option value="Administrator">Administrator</option>
            <option value="Artist">Artist</option>
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-b border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Role</th>
              <th className="px-4 py-2 border-b text-left">Type</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentFilteredUsers.map((user:any, index:any) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b">{user.firstName+' '+user.lastName}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.role}</td>
                {/* <td className="px-4 py-2 border-b">{user.type}</td> */}
                <td className="px-4 py-2 border-b">
                  <span
                    className={`inline-block w-24 text-center py-2 rounded-full ${
                      user.status === "Active"
                        ? "bg-[#548fec] text-white"
                        : "bg-red text-white"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <button className="text-[#1C4A93] hover:text-blue-700 mx-2">
                    <FaPen />
                  </button>
                  <button className="text-red hover:text-red-700 mx-2">
                    <FaTrash />
                  </button>
                  <button
                    className="bg-green hover:bg-green-700 text-white px-2 py-1 rounded mx-2 w-[100px] outline-none"
                    onClick={() => toggleUserStatus(user.email)}
                  >
                    {user.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-700">Page {currentPage}</span>
      </div>

      <div className="flex justify-end space-x-1 mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 ${
              currentPage === index + 1
                ? "bg-[#1C4A93] text-white outline-none"
                : "bg-gray-200 text-gray-700 outline-none"
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserManage;