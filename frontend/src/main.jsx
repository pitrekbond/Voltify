import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/custom-bootstrap.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Homescreen from "./screens/Homescreen";
import ProductScreen from "./screens/ProductScreen";
import store from "./store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Provider } from "react-redux";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PrivateRoute from "./components/PrivateRoute";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderDetailsScreen from "./screens/OrderDetailsScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import MyOrdersScreen from "./screens/MyOrdersScreen";
import AdminRoute from "./components/AdminRoute";
import OrderListScreen from "./screens/admin/OrderListScreen";
import ProductListScreen from "./screens/admin/ProductListScreen";
import EditProductScreen from "./screens/admin/EditProductScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import EditUserScreen from "./screens/admin/EditUserScreen";
import WishListScreen from "./screens/WishListScreen";
import Statistics from "./screens/admin/Statistics";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Homescreen />} />
      <Route path="/page/:pageNumber" element={<Homescreen />} />
      <Route path="/search/:keyword" element={<Homescreen />} />
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<Homescreen />}
      />
      <Route path="/filter/:category" element={<Homescreen />} />
      <Route
        path="/filter/:category/page/:pageNumber"
        element={<Homescreen />}
      />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/wishlist" element={<WishListScreen />} />
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderDetailsScreen />} />
        <Route path="/profile" element={<UserProfileScreen />} />
        <Route path="/orders" element={<MyOrdersScreen />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderList" element={<OrderListScreen />} />
        <Route path="/admin/productList" element={<ProductListScreen />} />
        <Route
          path="/admin/productList/:pageNumber"
          element={<ProductListScreen />}
        />
        <Route path="/admin/product/:id/edit" element={<EditProductScreen />} />
        <Route path="/admin/userList" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<EditUserScreen />} />
        <Route path="/admin/statistics" element={<Statistics />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </StrictMode>
);
