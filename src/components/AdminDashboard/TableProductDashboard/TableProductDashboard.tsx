import { Link } from "react-router";
import { useProduct } from "../../../context/useProduct";
import TableProducts from "./TableProducts";
import {
  FiPackage,
  FiDollarSign,
  FiTrendingDown,
  FiPlus,
} from "react-icons/fi";
import { useMemo } from "react";

const TableProductDashboard = () => {
  const { products, productsLoading } = useProduct();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + (p.discountedPrice || p.price) * p.stock,
      0,
    );
    const productsWithDiscount = products.filter(
      (p) => (p.discountPercentage ?? 0) > 0,
    ).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    return { totalProducts, totalValue, productsWithDiscount, outOfStock };
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your product inventory and pricing
          </p>
        </div>
        <Link
          to="/admin/dashboard/products/createProduct"
          className="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiPlus className="text-lg" />
          Create Product
        </Link>
      </div>

      {/* Statistics Cards */}
      {!productsLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiPackage className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Inventory Value
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.totalValue.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FiDollarSign className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  With Discounts
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.productsWithDiscount}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FiTrendingDown className="text-2xl text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Out of Stock
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.outOfStock}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <FiPackage className="text-2xl text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {productsLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
          </div>
        ) : (
          <TableProducts products={products} />
        )}
      </div>
    </div>
  );
};

export default TableProductDashboard;
