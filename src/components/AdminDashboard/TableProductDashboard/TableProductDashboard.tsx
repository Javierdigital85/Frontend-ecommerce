import { Link } from "react-router";
import { useProduct } from "../../../context/useProduct";
import TableProducts from "./TableProducts";
import { FiPackage, FiDollarSign, FiTrendingDown, FiPlus, FiSearch, FiAlertCircle } from "react-icons/fi";
import { useMemo, useState } from "react";
import { useTranslation } from "../../../hook/useTranslation";

const StatCard = ({
  label, value, icon, color,
}: {
  label: string; value: string | number; icon: React.ReactNode; color: string;
}) => (
  <div className={`bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm border border-slate-100`}>
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
  </div>
);

const TableProductDashboard = () => {
  const { products, productsLoading } = useProduct();
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const stats = useMemo(() => ({
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.discountedPrice || p.price) * p.stock, 0),
    productsWithDiscount: products.filter((p) => (p.discountPercentage ?? 0) > 0).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  }), [products]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    return products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.productManagement}</h2>
          <p className="text-slate-500 text-sm mt-0.5">{t.productManagementDesc}</p>
        </div>
        <Link
          to="/admin/dashboard/products/createProduct"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow transition-all text-sm"
        >
          <FiPlus size={16} />
          {t.createProduct}
        </Link>
      </div>

      {/* Stats */}
      {!productsLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label={t.totalProducts} value={stats.totalProducts} icon={<FiPackage size={20} className="text-blue-600" />} color="bg-blue-50" />
          <StatCard label={t.inventoryValue} value={`$${stats.totalValue.toFixed(0)}`} icon={<FiDollarSign size={20} className="text-emerald-600" />} color="bg-emerald-50" />
          <StatCard label={t.withDiscounts} value={stats.productsWithDiscount} icon={<FiTrendingDown size={20} className="text-amber-600" />} color="bg-amber-50" />
          <StatCard label={t.outOfStock} value={stats.outOfStock} icon={<FiAlertCircle size={20} className="text-red-500" />} color="bg-red-50" />
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search bar inside card */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder={t.searchProducts}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>
          {searchTerm && (
            <span className="text-xs text-slate-500">{filteredProducts.length} {t.resultsFound}</span>
          )}
        </div>

        {productsLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
          </div>
        ) : (
          <TableProducts products={filteredProducts} />
        )}
      </div>
    </div>
  );
};

export default TableProductDashboard;
