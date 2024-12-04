import Export from "../assets/ExportIcon.svg"
import { AddTaskRounded, ArrowRightAltOutlined, AssignmentReturnRounded, AttachMoneyRounded, LocalAtmRounded, LocalConvenienceStoreRounded, MonetizationOnRounded, PendingRounded, PersonAddAlt1Rounded } from "@mui/icons-material";
import TotalSalesCard from "../components/dashboard/Admin/CardSales"
import { BarChart, LineChart, PieChart } from "@mui/x-charts"
import { Link } from "react-router-dom";
import CategoryOrder from "../components/dashboard/Table/CategoryOrder";
import BestSales from "../components/dashboard/Table/BestSales";
import { useEffect, useState } from "react";
import axios from "axios";
import { AnyComponent } from "styled-components/dist/types";


const AdminDashboard = () => {
    const BASE_URL= import.meta.env.VITE_BASE_URL;
    const [totalUsers, setTotalUsers]=useState(0);
    const [totalShops, setTotalShops]=useState(0);
    const fetchAllUsers= async ()=>{
        const response= await axios.get(`${BASE_URL}/user/all-users`)
        const users=response.data.data.users as Array<any>;
        console.log(users);
        setTotalUsers(users.length);
    }
    const fetchAllShops= async ()=>{
        const response= await axios.get(`${BASE_URL}/shops`)
        const shops= response.data.data.shops as Array<any>;
        console.log(shops);
        setTotalShops(shops.length);
        
    }
    useEffect(()=>{
        fetchAllUsers();
        fetchAllShops();
    },[])
    function getGreeting(): string {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 12) {
            return 'Good Morning';
        }
        if (hour < 18) {
            return 'Good Afternoon';
        }
        return 'Good Evening';
    }

    const greetings = getGreeting();

    return (

        <div className="bg-dashgrey min-h-screen">
            <div className="rounded-md">
                <div className="md:flex items-center justify-between rounded-2xl bg-white p-4">
                    <div>
                        <p className="text-dashgreytext text-sm">{greetings}, </p>
                        <p className="font-semibold text-2xl">
                            Ambroise
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-4 p-5 rounded-2xl bg-white">
                <div className="flex items-center justify-between">
                    <h1>Total Sales Available</h1>
                    <button
                        className="border flex items-center px-2 py-1 rounded-md"
                        type="submit"
                    >
                        <img src={Export} alt="Export" />
                        Export
                    </button>
                </div>
                <p className="font-bold text-lg mb-7">Sales Summary</p>
                <div className="grid md:grid-cols-4 gap-6">
                    <TotalSalesCard icon={<AttachMoneyRounded />} title={"Total Sales"} totalSales={0} percentageChange={5} />
                    <TotalSalesCard icon={<LocalConvenienceStoreRounded />} title={"Total Shops"} totalSales={totalShops} percentageChange={1} />
                    <TotalSalesCard icon={<PersonAddAlt1Rounded />} title={"Total Users"} totalSales={totalUsers} percentageChange={-2} />
                    <TotalSalesCard icon={<AddTaskRounded />} title={"Pending Approvals"} totalSales={0} percentageChange={1} />
                    <TotalSalesCard icon={<PendingRounded />} title={"Pending orders"} totalSales={0} percentageChange={20} />
                    <TotalSalesCard icon={<AssignmentReturnRounded />} title={"Total Returns"} totalSales={0} percentageChange={-10} />
                    <TotalSalesCard icon={<LocalAtmRounded />} title={"Total Profit"} totalSales={0} percentageChange={10} />
                    <TotalSalesCard icon={<MonetizationOnRounded />} title={"Total Net Income"} totalSales={0} percentageChange={25} />
                </div>
                <div id="charts" className="py-10 grid md:grid-cols-3 gap-5">
                    <div className=" bg-white shadow-md p-5 rounded-xl">
                        <h2 className="font-bold py-5">Monthly sales</h2>
                        <BarChart
                            series={[
                                { data: [35, 44, 24, 34] },
                                { data: [51, 6, 49, 30] },
                                { data: [15, 25, 30, 50] },
                                { data: [60, 50, 15, 25] },
                            ]}
                            height={290}
                            xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
                            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                            borderRadius={20}
                        />
                    </div>
                    <div className="bg-white shadow-md p-5 rounded-xl">
                        <h2 className="font-bold py-5">Monthly Profit vs Expenses</h2>
                        <LineChart
                            series={[
                                { data: [35, 44, 24, 34] },
                                { data: [51, 6, 49, 30] },
                                { data: [15, 25, 30, 50] },
                                { data: [60, 50, 15, 25] },
                            ]}
                            height={290}
                            xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
                            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                        />
                    </div>
                    <div className="bg-white shadow-md p-5 rounded-xl">
                        <h2 className="font-bold py-5">Best selling categories</h2>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { id: 0, value: 10, label: 'series A' },
                                        { id: 1, value: 15, label: 'series B' },
                                        { id: 2, value: 20, label: 'series C' },
                                    ],
                                    innerRadius: 30,
                                    outerRadius: 100,
                                    paddingAngle: 5,
                                    cornerRadius: 5,
                                    startAngle: -45,
                                    endAngle: 225,

                                }

                            ]}
                            height={290}
                        />
                    </div>
                </div>
                <section id="pending-approvals" className="pb-10">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-5 shadow-md">
                            <h1 className="font-bold text-xl">Pending Shop Approvals</h1>
                            <p className="text-sm mb-7">Review and approve pending shop registrations</p>
                            <div>
                                <table cellSpacing={100} cellPadding={10}>
                                    <thead>
                                        <tr>
                                            <th>Shop Name</th>
                                            <th>Location</th>
                                            <th>Contact Person</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Kigali Shoes</td>
                                            <td>Kigali</td>
                                            <td>John Doe</td>
                                            <td className="text-orange">Pending</td>
                                            <td>
                                                <div className="flex flex-row gap-x-4 items-center">
                                                    <button className="flex items-center px-2 py-1 rounded-md text-white bg-secondary hover:bg-blue-700">
                                                        Approve
                                                    </button>
                                                    <button className="flex items-center px-2 py-1 rounded-md text-white bg-red hover:bg-red-700">
                                                        Reject
                                                    </button>
                                                </div>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Karizm</td>
                                            <td>Gisenyi</td>
                                            <td>Jane Doe</td>
                                            <td className="text-orange">Pending</td>
                                            <td>
                                                <div className="flex flex-row gap-x-4 items-center">
                                                    <button className="flex items-center px-2 py-1 rounded-md text-white bg-secondary hover:bg-blue-700">
                                                        Approve
                                                    </button>
                                                    <button className="flex items-center px-2 py-1 rounded-md text-white bg-red hover:bg-red-700">
                                                        Reject
                                                    </button>
                                                </div>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Karizm</td>
                                            <td>Gisenyi</td>
                                            <td>Jane Doe</td>
                                            <td className="text-orange">Pending</td>
                                            <td>
                                                <div className="flex flex-row gap-x-4 items-center">
                                                    <button className="flex items-center px-2 py-1 rounded-md text-white bg-secondary hover:bg-blue-700">
                                                        Approve
                                                    </button>
                                                    <button className="flex items-center px-2 py-1 rounded-md text-white bg-red hover:bg-red-700">
                                                        Reject
                                                    </button>
                                                </div>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="flex flex-row items-center gap-x-2 justify-center">
                                    <Link to={"#"} className="text-secondary">View All </Link>
                                    <span><ArrowRightAltOutlined className="text-secondary" /></span>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 shadow-md">
                            <h1 className="font-bold text-xl">Rejected Shop Approvals</h1>
                            <p className="text-sm mb-7">Rejected shops to register</p>
                            <div>
                                <table cellSpacing={100} cellPadding={10}>
                                    <thead>
                                        <tr>
                                            <th>Shop Name</th>
                                            <th>Location</th>
                                            <th>Contact Person</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Kigali Shoes</td>
                                            <td>Kigali</td>
                                            <td>John Doe</td>
                                            <td className="text-red">Rejected</td>
                                            <td>
                                                <div className="flex flex-row gap-x-4 items-center">
                                                    <button className="flex items-center px-2 py-1 rounded-md text-white bg-secondary hover:bg-blue-700">
                                                        Approve
                                                    </button>

                                                </div>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Karizm</td>
                                            <td>Gisenyi</td>
                                            <td>Jane Doe</td>
                                            <td className="text-red">Rejected</td>
                                            <td>
                                                <div className="flex flex-row gap-x-4 items-center">
                                                    <button className="flex items-center px-2 py-1 rounded-md text-white bg-secondary hover:bg-blue-700">
                                                        Approve
                                                    </button>

                                                </div>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Karizm</td>
                                            <td>Gisenyi</td>
                                            <td>Jane Doe</td>
                                            <td className="text-red">Rejected</td>
                                            <td>
                                                <div className="flex flex-row gap-x-4 items-center">
                                                    <button className="flex items-center px-2 py-1 rounded-md text-white bg-secondary hover:bg-blue-700">
                                                        Approve
                                                    </button>

                                                </div>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="flex flex-row items-center gap-x-2 justify-center">
                                    <Link to={"#"} className="text-secondary">View All </Link>
                                    <span><ArrowRightAltOutlined className="text-secondary" /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <CategoryOrder/>
                    <BestSales/>
                </section>
            </div>
        </div>
    )

}

export default AdminDashboard