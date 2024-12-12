import React, { useState, useEffect } from "react";
import { Eye, AlertCircle, Trash2, CheckCircle2, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../UI/Card";
import { DialogContent, DialogHeader, DialogTitle } from "../../../UI/Dialog";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationCard from "../../../ConfirmationPage/ConfirmationCard";
import { useAppSelector } from "../../../../Redux/hooks";

import {
  fetchNotifications,
  updateNotificationStatus,
  deleteNotification,
  fetchNotificationSummary,
} from "../../../../Redux/Slices/NotificationSlices";
import { RootState } from "../../../../Redux/store";

interface Notification {
  id: string;
  type: "Contact" | "Subscription" | "Product" | "System";
  message: string;
  dateReceived: string;
  status: "read" | "unread";
  priority: "high" | "medium" | "low";
  details?: {
    recipientName?: string;
    recipientEmail?: string;
    message?: string;
    content?: string;
  };
}

const ManageNotification = () => {
  const dispatch = useDispatch();
  const { notifications, notificationSummary, loading, error } = useSelector(
    (state: RootState) => state.notifications
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentNotificationId, setCurrentNotificationId] = useState<number | null>(null);
  const [isConfirmationModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchNotificationSummary());
  }, [dispatch]);

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedStatus !== "all" && notification.status !== selectedStatus) return false;
    if (
      selectedType !== "all" &&
      notification.type.toLowerCase() !== selectedType.toLowerCase()
    )
      return false;
    if (
      searchQuery &&
      !notification.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !notification.id.toString().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleOpenDetailsModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setCurrentNotificationId(id);
    setModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (currentNotificationId !== null) {
       dispatch(deleteNotification(currentNotificationId));
      dispatch(fetchNotifications()); // Refetch notifications to reflect changes
      dispatch(fetchNotificationSummary());
    }
    setModalVisible(false);
    setCurrentNotificationId(null);
  };

  const handleDeleteCancel = () => {
    setModalVisible(false);
    setCurrentNotificationId(null);
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredNotifications.map((n) => n.id) : []);
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const summaryCards = [
    {
      title: "Total Notifications",
      value: notificationSummary.totalCount || 0,
    },
    {
      title: "Unread Notifications",
      value: notificationSummary.unreadCount || 0,
    },
    {
      title: "High Priority Notifications",
      value: notificationSummary.highPriorityCount || 0,
    },
    {
      title: "Last 24 Hours Count",
      value: notificationSummary.last24HoursCount || 0,
    },
  ];

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
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin w-8 h-8 text-blue" />
        </div>
      ) : (
        <>
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

          <div className="overflow-x-auto">
            <table className="min-w-full border-b border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === filteredNotifications.length
                      }
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
                      notification.status === "UNREAD" ? "bg-blue-50" : ""
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
                    <td
                      className={`p-4 ${getPriorityClass(notification.priority)}`}
                    >
                      {notification.priority}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          notification.status === "UNREAD"
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
                        onClick={() => handleDeleteClick(notification.id)}
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
        </>
      )}
      <ConfirmationCard
        isVisible={isConfirmationModalVisible}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this Notification?"
      />
      {showDetailsModal && selectedNotification && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Notification Details - {selectedNotification.id}
            </DialogTitle>
          </DialogHeader>
          <div>
            <p>
              <strong>Type:</strong> {selectedNotification.type}
            </p>
            <p>
              <strong>Message:</strong> {selectedNotification.message}
            </p>
            <p>
              <strong>Date Received:</strong> {selectedNotification.dateReceived}
            </p>
            <p>
              <strong>Priority:</strong> {selectedNotification.priority}
            </p>
            <p>
              <strong>Status:</strong> {selectedNotification.status}
            </p>
            {selectedNotification.details && (
              <>
                <p>
                  <strong>Recipient Name:</strong>{" "}
                  {selectedNotification.details.recipientName}
                </p>
                <p>
                  <strong>Recipient Email:</strong>{" "}
                  {selectedNotification.details.recipientEmail}
                </p>
                <p>
                  <strong>Content:</strong>{" "}
                  {selectedNotification.details.content}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      )}
    </div>
  );
};

export default ManageNotification;
