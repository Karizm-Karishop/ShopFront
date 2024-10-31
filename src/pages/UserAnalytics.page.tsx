import { AssignmentReturnRounded, PendingRounded, AddTaskRounded, PersonAddAlt1Rounded } from "@mui/icons-material"
import TotalSalesCard from "../components/dashboard/Admin/CardSales"
import Export from "../assets/ExportIcon.svg"
import { BarChart, LineChart, PieChart } from "@mui/x-charts"
const UserAnalytics = () => {
    return (
        <div className="bg-dashgrey min-h-screen">
            <div className="mt-4 p-5 rounded-2xl bg-white">
                <div className="flex items-center justify-between">
                    <h1>All data Available</h1>
                    <button
                        className="border flex items-center px-2 py-1 rounded-md"
                        type="submit"
                    >
                        <img src={Export} alt="Export" />
                        Export
                    </button>
                </div>
                <p className="font-bold text-lg mb-7">Users activity summary</p>
                <div className="grid md:grid-cols-4 gap-6">
                    <TotalSalesCard icon={<PersonAddAlt1Rounded />} title={"Total Users"} totalSales={100} percentageChange={-2} />
                    <TotalSalesCard icon={<AddTaskRounded />} title={"Total Time Spent"} totalSales={"50000 hrs"} percentageChange={1} />
                    <TotalSalesCard icon={<PendingRounded />} title={"File Uploads"} totalSales={5000} percentageChange={20} />
                    <TotalSalesCard icon={<AssignmentReturnRounded />} title={"Suspicious activities"} totalSales={5} percentageChange={-10} />
                </div>

                <div id="report" className="my-10">
                    <div className="grid md:grid-cols-3 gap-x-4">
                        <div className="shadow-md p-4 rounded-xl">
                        <p className="font-bold py-4">Most active users</p>
                            <div className="flex flex-col gap-y-4">
                                <div className="flex flex-row items-center gap-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center p-2 border-2 border-black">
                                        <p className="font-bold text-center">JM</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-600">Justin Mihigo</h3>
                                        <p className="text-sm font-light text-gray-400">Total Time Spent: 50000 hrs</p>
                                    </div>
                            
                                </div>
                                <div className="flex flex-row items-center gap-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center p-2 border-2 border-black">
                                        <p className="font-bold text-center">KC</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-600">Kwizera Christian</h3>
                                        <p className="text-sm font-light text-gray-400">Total Time Spent: 45700 hrs</p>
                                    </div>
                            
                                </div>
                                <div className="flex flex-row items-center gap-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center p-2 border-2 border-black">
                                        <p className="font-bold text-center">RH</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-600">Robert Hakuzimana</h3>
                                        <p className="text-sm font-light text-gray-400">Total Time Spent: 45600 hrs</p>
                                    </div>
                            
                                </div>
                                <div className="flex flex-row items-center gap-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center p-2 border-2 border-black">
                                        <p className="font-bold text-center">JM</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-600">Julien Mihigo</h3>
                                        <p className="text-sm font-light text-gray-400">Total Time Spent: 45500 hrs</p>
                                    </div>
                            
                                </div>
                                <div className="flex flex-row items-center gap-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center p-2 border-2 border-black">
                                        <p className="font-bold text-center">MM</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-600">Maurice Mihigo</h3>
                                        <p className="text-sm font-light text-gray-400">Total Time Spent: 45000 hrs</p>
                                    </div>
                            
                                </div>
                            </div>
                        </div>
                        <div className="shadow-md p-4 rounded-xl">
                            <h2 className="font-bold py-5">Page visits</h2>
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
                        <div className="shadow-md p-4 rounded-xl">
                            <h2 className="font-bold py-5">Engagement rate</h2>
                            <LineChart
                                series={[
                                    { data: [35, 44, 24, 34], area: true },
                                    { data: [51, 6, 49, 30], area: true },

                                ]}
                                height={290}
                                xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
                                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UserAnalytics