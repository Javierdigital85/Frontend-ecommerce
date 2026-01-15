import { Link } from "react-router";
import { useProduct } from "../../../context/useProduct";
import TableProducts from "./TableProducts";

const TableProductDashboard = () => {
  const { products, productsLoading } = useProduct();
  console.log("products", products);

  return (
    <>
      <div className="flex items-center gap-4 justify-center">
        <h1>Admin Productos</h1>
        <Link
          to="/admin/dashboard/products/createProduct"
          className="btn bg-blue-600 hover:bg-blue-700 text-white"
        >
          Crear Producto
        </Link>
      </div>
      <div className="overflow-x-auto">
        {productsLoading ? (
          <div className="loading loading-spinner"></div>
        ) : (
          <TableProducts products={products} />
        )}
      </div>
    </>
  );
};

export default TableProductDashboard;
