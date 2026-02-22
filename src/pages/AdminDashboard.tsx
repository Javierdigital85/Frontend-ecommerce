import { Routes, Route } from "react-router";
import TableProductDashboard from "../components/AdminDashboard/TableProductDashboard/TableProductDashboard";
import DashboardLayout from "../Layout/DashboardLayout";
import CreateProduct from "./CreateProduct";
import UpdateProduct from "./UpdateProduct";
import AdminUsers from "./AdminUsers";

const AdminDashboard = () => {
  return (
    <section>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/products" element={<TableProductDashboard />} />
          <Route path="/products/createProduct" element={<CreateProduct />} />
          <Route
            path="/products/updateProduct/:id"
            element={<UpdateProduct />}
          />
          <Route path="/users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </section>
  );
};

export default AdminDashboard;
