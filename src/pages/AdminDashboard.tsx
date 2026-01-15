import { Routes, Route } from "react-router";
import TableProductDashboard from "../components/AdminDashboard/TableProductDashboard/TableProductDashboard";
import DashboardLayout from "../Layout/DashboardLayout";
import CreateProduct from "./CreateProduct";
import UpdateProduct from "./UpdateProduct";

const AdminDashboard = () => {
  return (
    <section>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/products" element={<TableProductDashboard />} />
          <Route path="/products/createProduct" element={<CreateProduct/>}/>
          <Route path="/products/updateProduct/:id" element={<UpdateProduct/>}/>
        </Route>
      </Routes>
    </section>
  );
};

export default AdminDashboard
