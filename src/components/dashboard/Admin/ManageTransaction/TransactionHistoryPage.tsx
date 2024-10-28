import { useState } from "react";
import { Eye, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../UI/Card";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../UI/CustomComponents";
import { Trash2 } from "lucide-react";
interface Transaction {
  id: string;
  user: string;
  userEmail: string;
  amount: string;
  type: "Purchase" | "Refund" | "Donation";
  date: string;
  status: "completed" | "pending" | "failed";
  paymentMethod: string;
  orderId?: string;
}

interface TransactionSummary {
  totalTransactions: number;
  totalRevenue: string;
  refundsProcessed: string;
  successRate: string;
}

const TransactionHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const summary: TransactionSummary = {
    totalTransactions: 1234,
    totalRevenue: "1,234,567 UGX",
    refundsProcessed: "12,345 UGX",
    successRate: "98.5%",
  };

  const transactionData: Transaction[] = Array.from({ length: 20 }, (_, i) => ({
    id: `TRX${String(i + 1).padStart(3, "0")}`,
    user: `User ${i + 1}`,
    userEmail: `user${i + 1}@example.com`,
    amount: `${(Math.random() * 100000).toFixed(2)} UGX`,
    type: ["Purchase", "Refund", "Donation"][
      Math.floor(Math.random() * 3)
    ] as Transaction["type"],
    date: new Date(Date.now() - Math.random() * 10000000000)
      .toISOString()
      .split("T")[0],
    status: ["completed", "pending", "failed"][
      Math.floor(Math.random() * 3)
    ] as Transaction["status"],
    paymentMethod: ["Credit Card", "Mobile Money", "Bank Transfer"][
      Math.floor(Math.random() * 3)
    ],
    orderId: `ORD${String(i + 1).padStart(3, "0")}`,
  }));

  const filteredTransactions = transactionData.filter((transaction) => {
    if (selectedStatus !== "all" && transaction.status !== selectedStatus)
      return false;
    if (
      selectedType !== "all" &&
      transaction.type.toLowerCase() !== selectedType.toLowerCase()
    )
      return false;
    if (
      searchQuery &&
      !transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !transaction.user.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleOpenDetailsModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const summaryCards = [
    {
      title: "Total Transactions",
      value: summary.totalTransactions,
      change: "+20.1%",
      trend: "increase",
    },
    {
      title: "Total Revenue",
      value: summary.totalRevenue,
      change: "+15.5%",
      trend: "increase",
    },
    {
      title: "Refunds Processed",
      value: summary.refundsProcessed,
      change: "-5.2%",
      trend: "decrease",
    },
    {
      title: "Success Rate",
      value: summary.successRate,
      change: "+2.3%",
      trend: "increase",
    },
  ];
  const handleDeleteTransaction = (transactionId: string) => {
    console.log(`Deleting transaction with ID: ${transactionId}`);
  };

  const getStatusTagClass = (status: string) => {
    return status === "completed"
      ? "text-green"
      : status === "pending"
      ? "text-yellow"
      : "text-red";
  };
  return (
    <div className="p-6">
      <CardTitle>Transaction History</CardTitle>
      <div className="grid md:grid-cols-4 gap-6 w-full mb-5">
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p
                className={`text-xs ${
                  card.trend === "increase" ? "text-green" : "text-red"
                }`}
              >
                {card.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by ID or User"
          className="border rounded p-2 flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border rounded p-2 ml-2"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Purchase">Purchases</option>
          <option value="Refund">Refunds</option>
          <option value="Donation">Donations</option>
        </select>
        <select
          className="border rounded p-2 ml-2"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      {showDetailsModal && selectedTransaction && (
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          <Card className="my-4">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Details for {selectedTransaction.id}
              </CardTitle>
            </CardHeader>
            <div className="flex flex-col w-full justify-between px-5 mb-6 lg:flex-row md:flex-row">
              <Card className="flex flex-row gap-10 px-10 py-5">
                <span className="font-medium">User:</span>
                <span>{selectedTransaction.user}</span>
              </Card>
              <Card className="flex flex-row gap-10 px-10 py-5">
                <span className="font-medium">Email:</span>
                <span>{selectedTransaction.userEmail}</span>
              </Card>
              <Card className="flex flex-row gap-10 px-10 py-5">
                <span className="font-medium">Amount:</span>
                <span>{selectedTransaction.amount}</span>
              </Card>
              <Card className="flex flex-row gap-10 px-10 py-5">
                <span className="font-medium">Type:</span>
                <span>{selectedTransaction.type}</span>
              </Card>
              <Card className="flex flex-row gap-10 px-10 py-5">
                <span className="font-medium">Status:</span>
                <span>{selectedTransaction.status}</span>
              </Card>
            </div>
          </Card>
        </DialogContent>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-b border-gray-300">
          <thead>
            <tr>
              <th className="border-b border-gray-300 p-2 text-left">
                Transaction ID
              </th>
              <th className="border-b border-gray-300 p-2 text-left">
                User Name
              </th>
              <th className="border-b border-gray-300 p-2 text-left">Amount</th>
              <th className="border-b border-gray-300 p-2 text-left">Type</th>
              <th className="border-b border-gray-300 p-2 text-left">Date</th>
              <th className="border-b border-gray-300 p-2 text-left">Status</th>
              <th className="border-b border-gray-300 p-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="border-b border-gray-300 p-2">
                  {transaction.id}
                </td>
                <td className="border-b border-gray-300 p-2">
                  {transaction.user}
                </td>
                <td className="border-b border-gray-300 p-2">
                  {transaction.amount}
                </td>
                <td className="border-b border-gray-300 p-2">
                  {transaction.type}
                </td>
                <td className="border-b border-gray-300 p-2">
                  {transaction.date}
                </td>
                <td
                  className={`border-b border-gray-300 p-2 ${getStatusTagClass(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </td>
                <td className="border-b border-gray-300 p-2">
                  <button
                    className="text-blue-500"
                    onClick={() => handleOpenDetailsModal(transaction)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-500 ml-5"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
