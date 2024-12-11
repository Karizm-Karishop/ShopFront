import { FunctionComponent } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomeLayout from "../Layout/Home.layout";
import Shop from "../pages/Shop.page.tsx";
import Home from "../pages/Home.page";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ContactForm from "../pages/ContactUs";
import Aboutus from "../pages/AboutUs";
import PasswordResetRequestForm from "../components/Password/PasswordResetRequest.tsx";
import TwoFactorAuth from "../pages/TwoFactorAuth.page.tsx";
import ConfirmToChangePassword from "../components/Password/ConfirmToChangePassword.page.tsx";
import DisplayProduct from "../components/dashboard/Artist/DisplayProduct.tsx";
import DashboardLayout from "../components/dashboard/Artist/DashbordLayout.tsx";
import ArtistDashHome from "../components/dashboard/Artist/ArtistDashHome.tsx";
import AddProducts from "../components/dashboard/Product/addProducts.tsx";
import ProductDetails from "../pages/ProductDetails.page.tsx";
import OrdersTable from "../components/dashboard/Table/OrdersTable.tsx";
import AddShopForm from "../components/dashboard/Artist/Shop/AddShopForm.tsx";
import MyShops from "../components/dashboard/Artist/Shop/Myshops.tsx";
import AddCategoryForm from "../components/dashboard/Artist/Category/AddCategoryForm.tsx";
import Profile from "../components/dashboard/Artist/Profile/Profile.tsx";
import PostBook from "../components/dashboard/Artist/Books/PostBook.tsx";
import AllBooks from "../components/dashboard/Artist/Books/AllBooks.tsx";
import AllCategories from "../components/dashboard/Artist/Category/AllCategory.tsx";
import AddMusicForm from "../components/dashboard/Artist/music/AddMusic.tsx";
import AllMusicTable from "../components/dashboard/Artist/music/AllMusic.tsx";
import AllProducts from "../components/dashboard/Product/AllProducts.tsx";
import Cart from "../pages/Cart.page.tsx";
import Wishlist from "../pages/Wishlist.page.tsx";
import Checkout from "../pages/checkout.page.tsx";
import AdminDashbordLayout from "../components/dashboard/Admin/AdminDashbordLayout.tsx";
import TableUserRole from "../components/dashboard/Admin/TableUserRole.tsx";
import UserManage from "../components/dashboard/Admin/UserManage.tsx";
import ShopApprovalTable from "../components/dashboard/Admin/ApprovalShop.tsx";
import AdminAddCategoryForm from "../components/dashboard/Admin/Category/AddCategoryForm.tsx";
import AdminAllCategories from "../components/dashboard/Admin/Category/AllCategory.tsx";
import AdminDashboardHome from "../pages/AdminDashboard.page.tsx";
import SalesAnalytics from "../pages/SalesAnalytics.page.tsx";
import AddAlbums from "../components/dashboard/Artist/Albums/AddAlbums.tsx";
import AllAlbums from "../components/dashboard/Artist/Albums/AllAlbums.tsx";
import TransactionHistoryPage from "../components/dashboard/Admin/ManageTransaction/TransactionHistoryPage.tsx";
import ManageNotification from "../components/dashboard/Admin/ManageNotification/ManageNotification.tsx";
import ManageUnread from "../components/dashboard/Admin/ManageNotification/ManageUnread.tsx";
import UserAnalytics from "../pages/UserAnalytics.page.tsx";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ConfirmationEmailVerificationNotifyPage from "../components/ConfirmationPage/ConfirmationEmailVerificationNotifyPage.tsx";
const AppRoutes: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/confirmation" element={<ConfirmationEmailVerificationNotifyPage />} />
          <Route
            path="/forgot-password"
            element={<PasswordResetRequestForm />}
          />
          <Route path="/two-factor-auth" element={<TwoFactorAuth />} />
          <Route
            path="/change-password"
            element={<ConfirmToChangePassword />}
          />
          <Route path="/productDetails" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute roles={["client","artist","admin"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
        <Route
          element={
            <ProtectedRoute roles={["artist"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index path="/dashboard" element={<ArtistDashHome />} />
          <Route path="/dashboard/product" element={<DisplayProduct />} />
          <Route path="/dashboard/product/add" element={<AddProducts />} />
          <Route path="/dashboard/product/all" element={<AllProducts />} />
          <Route path="/dashboard/orders/all" element={<OrdersTable />} />
          <Route path="/dashboard/shop/add" element={<AddShopForm />} />
          <Route path="/dashboard/shop/all" element={<MyShops />} />
          <Route path="/dashboard/category/add" element={<AddCategoryForm />} />
          <Route path="/dashboard/category/all" element={<AllCategories />} />
          <Route path="/dashboard/user/profile" element={<Profile />} />
          <Route path="/dashboard/books/add" element={<PostBook />} />
          <Route path="/dashboard/books/all" element={<AllBooks />} />
          <Route path="/dashboard/music/create" element={<AddMusicForm />} />
          <Route path="/dashboard/music/album/create" element={<AddAlbums />} />
          <Route path="/dashboard/music/album/all" element={<AllAlbums />} />
          <Route path="/dashboard/music/all" element={<AllMusicTable />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashbordLayout />
            </ProtectedRoute>
          }
        >
          <Route index path="/admin" element={<AdminDashboardHome />} />
          <Route path="/admin/users/roles" element={<TableUserRole />} />
          <Route path="/admin/users/all" element={<UserManage />} />
          <Route path="/admin/shops/approval" element={<ShopApprovalTable />} />
          <Route
            path="/admin/category/add"
            element={<AdminAddCategoryForm />}
          />
          <Route path="/admin/category/all" element={<AdminAllCategories />} />
          <Route path="/admin/analytics/sales" element={<SalesAnalytics />} />
          <Route
            path="admin/transactions/history"
            element={<TransactionHistoryPage />}
          />
          <Route
            path="admin/notifications/manage"
            element={<ManageNotification />}
          />
          <Route path="admin/notifications/unread" element={<ManageUnread />} />
          <Route
            path="/admin/analytics/user-activity"
            element={<UserAnalytics />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
