import { useState } from "react";
import { RefreshCcw, Eye, Trash2, CheckCircle2, Mail, Bell, UserPlus, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../UI/Card";

interface UnreadNotification {
  id: string;
  type: "Contact" | "Subscription" | "Product" | "System";
  message: string;
  dateReceived: string;
  category: string;
  priority: "high" | "medium" | "low";
  preview: string;
}

interface CategoryCount {
  icon: React.ReactNode;
  name: string;
  count: number;
  color: string;
}

const ManageUnread = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");

  const unreadData: UnreadNotification[] = Array.from({ length: 15 }, (_, i) => ({
    id: `UNR${String(i + 1).padStart(3, "0")}`,
    type: ["Contact", "Subscription", "Product", "System"][
      Math.floor(Math.random() * 4)
    ] as UnreadNotification["type"],
    message: `Unread notification ${i + 1}`,
    dateReceived: new Date(Date.now() - Math.random() * 1000000).toISOString(),
    category: ["Contact Us", "Subscriptions", "Product Updates", "System Alerts"][
      Math.floor(Math.random() * 4)
    ],
    priority: ["high", "medium", "low"][Math.floor(Math.random() * 3)] as UnreadNotification["priority"],
    preview: `Preview of notification content ${i + 1}. This is an important message that requires attention.`
  }));

  const categoryData: CategoryCount[] = [
    { icon: <Mail className="w-5 h-5" />, name: "Contact Us", count: 3, color: "text-blue" },
    { icon: <Bell className="w-5 h-5" />, name: "Subscriptions", count: 5, color: "text-green" },
    { icon: <UserPlus className="w-5 h-5" />, name: "Product Updates", count: 2, color: "text-purple" },
    { icon: <Settings className="w-5 h-5" />, name: "System Alerts", count: 4, color: "text-orange" }
  ];

  const filteredNotifications = filterCategory === "all" 
    ? unreadData 
    : unreadData.filter(note => note.category === filterCategory);

  const handleMarkAsRead = (ids: string[]) => {
    console.log("Marking as read:", ids);
    setSelectedItems([]);
  };

  const handleDeleteUnread = (ids: string[]) => {
    console.log("Deleting unread:", ids);
    setSelectedItems([]);
  };

  const handleRefresh = () => {
    console.log("Refreshing notifications");
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">Unread Notifications</CardTitle>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 text-blue hover:bg-blue-50 rounded-md"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {categoryData.map((category, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setFilterCategory(category.name)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <span className={category.color}>{category.icon}</span>
                <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
              </div>
              <span className="bg-blue-100 text-blue text-xs font-medium px-2.5 py-0.5 rounded-full">
                {category.count} Unread
              </span>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Unread Messages</CardTitle>
          <div className="space-x-2">
            {selectedItems.length > 0 && (
              <>
                <button
                  onClick={() => handleMarkAsRead(selectedItems)}
                  className="px-4 py-2 text-white bg-blue rounded-md hover:bg-blue-700"
                >
                  <CheckCircle2 className="w-4 h-4 inline mr-2" />
                  Mark as Read
                </button>
                <button
                  onClick={() => handleDeleteUnread(selectedItems)}
                  className="px-4 py-2 text-white bg-red rounded-md hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Delete Selected
                </button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredNotifications.length}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="rounded"
                    />
                  </th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Preview</th>
                  <th className="p-4 text-left">Date Received</th>
                  <th className="p-4 text-left">Priority</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(notification.id)}
                        onChange={() => toggleSelectItem(notification.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">{notification.type}</td>
                    <td className="p-4">
                      <div className="max-w-md truncate">{notification.preview}</div>
                    </td>
                    <td className="p-4">
                      {new Date(notification.dateReceived).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        notification.priority === "high" 
                          ? "bg-red-100 text-red"
                          : notification.priority === "medium"
                          ? "bg-yellow-100 text-yellow"
                          : "bg-green-100 text-green"
                      }`}>
                        {notification.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue hover:text-blue mr-2">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-red hover:text-red">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUnread;