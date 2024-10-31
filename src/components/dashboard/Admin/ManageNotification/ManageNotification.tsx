import { useState } from "react";
import { Eye, AlertCircle, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../UI/Card";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../UI/Dialog";

interface Notification {
  id: string;
  type: "Contact" | "Subscription" | "Product" | "System";
  message: string;
  dateReceived: string;
  status: "read" | "unread";
  priority: "high" | "medium" | "low";
  details?: {
    sender?: string;
    email?: string;
    subject?: string;
    content?: string;
  };
}

interface NotificationSummary {
  totalNotifications: number;
  unreadCount: number;
  highPriority: number;
  lastDayCount: number;
}

const ManageNotification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const summary: NotificationSummary = {
    totalNotifications: 156,
    unreadCount: 23,
    highPriority: 5,
    lastDayCount: 12,
  };

  // Sample notification data
  const notificationData: Notification[] = Array.from({ length: 20 }, (_, i) => ({
    id: `NOT${String(i + 1).padStart(3, "0")}`,
    type: ["Contact", "Subscription", "Product", "System"][
      Math.floor(Math.random() * 4)
    ] as Notification["type"],
    message: `Sample notification message ${i + 1}`,
    dateReceived: new Date(Date.now() - Math.random() * 10000000000)
      .toISOString()
      .split("T")[0],
    status: ["read", "unread"][Math.floor(Math.random() * 2)] as Notification["status"],
    priority: ["high", "medium", "low"][
      Math.floor(Math.random() * 3)
    ] as Notification["priority"],
    details: {
      sender: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      subject: `Notification Subject ${i + 1}`,
      content: `Detailed content for notification ${i + 1}`,
    },
  }));

  const summaryCards = [
    {
      title: "Total Notifications",
      value: summary.totalNotifications,
      change: "+12 today",
      trend: "increase",
    },
    {
      title: "Unread Messages",
      value: summary.unreadCount,
      change: "Requires attention",
      trend: "increase",
    },
    {
      title: "High Priority",
      value: summary.highPriority,
      change: "Critical items",
      trend: "decrease",
    },
    {
      title: "Last 24 Hours",
      value: summary.lastDayCount,
      change: "Recent activity",
      trend: "increase",
    },
  ];

  const filteredNotifications = notificationData.filter((notification) => {
    if (selectedStatus !== "all" && notification.status !== selectedStatus) return false;
    if (selectedType !== "all" && notification.type.toLowerCase() !== selectedType.toLowerCase())
      return false;
    if (
      searchQuery &&
      !notification.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !notification.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleOpenDetailsModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDetailsModal(true);
  };

  const handleMarkAsRead = (ids: string[]) => {
    console.log(`Marking notifications as read:`, ids);
  };

  const handleDelete = (ids: string[]) => {
    console.log(`Deleting notifications:`, ids);
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredNotifications.map(n => n.id) : []);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getPriorityClass = (priority: string) => {
    return priority === "high"
      ? "text-red"
      : priority === "medium"
      ? "text-yellow"
      : "text-green";
  };

  return (
    <div className="p-6 space-y-6">
      <CardTitle className="text-2xl font-bold">Manage Notifications</CardTitle>
      
      <div className="grid md:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className={`text-xs ${
                card.trend === "increase" ? "text-green" : "text-red"
              }`}>
                {card.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search notifications..."
          className="flex-1 p-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-2 border rounded-md"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Contact">Contact Messages</option>
          <option value="Subscription">Subscriptions</option>
          <option value="Product">Product Alerts</option>
          <option value="System">System Notifications</option>
        </select>
        <select
          className="p-2 border rounded-md"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>
      </div>

      {selectedItems.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-md flex justify-between items-center mb-4">
          <span>{selectedItems.length} items selected</span>
          <div className="space-x-4">
          <button
                  onClick={() => handleMarkAsRead(selectedItems)}
                  className="px-4 py-2 text-white bg-blue rounded-md hover:bg-blue-700"
                >
                  <CheckCircle2 className="w-4 h-4 inline mr-2" />
                  Mark as Read
                </button>
                <button
                  onClick={() => handleDelete(selectedItems)}
                  className="px-4 py-2 text-white bg-red rounded-md hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Delete Selected
                </button>
              
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-b border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredNotifications.length}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="rounded"
                />
              </th>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Message</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Priority</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.map((notification) => (
              <tr
                key={notification.id}
                className={`border-b border-gray-200 ${
                  notification.status === "unread" ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(notification.id)}
                    onChange={() => toggleSelectItem(notification.id)}
                    className="rounded"
                  />
                </td>
                <td className="p-4">{notification.id}</td>
                <td className="p-4">{notification.type}</td>
                <td className="p-4">{notification.message}</td>
                <td className="p-4">{notification.dateReceived}</td>
                <td className={`p-4 ${getPriorityClass(notification.priority)}`}>
                  {notification.priority}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      notification.status === "unread"
                        ? "text-blue"
                        : "bg-gray-100 text-green"
                    }`}
                  >
                    {notification.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleOpenDetailsModal(notification)}
                    className="text-blue hover:text-blue mr-2"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete([notification.id])}
                    className="text-red hover:text-red"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetailsModal && selectedNotification && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
          </DialogHeader>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedNotification.id} - {selectedNotification.type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><strong>Sender:</strong> {selectedNotification.details?.sender}</p>
                  <p><strong>Email:</strong> {selectedNotification.details?.email}</p>
                  <p><strong>Date:</strong> {selectedNotification.dateReceived}</p>
                  <p><strong>Status:</strong> {selectedNotification.status}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Subject:</strong> {selectedNotification.details?.subject}</p>
                  <p><strong>Priority:</strong> {selectedNotification.priority}</p>
                  <p><strong>Content:</strong> {selectedNotification.details?.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      )}
    </div>
  );
};

export default ManageNotification;