import { Link } from "react-router";
import { useProduct } from "../../../context/useProduct";
import toast from "react-hot-toast";
import type { Product } from "../../../interfaces/Product";
import { useState } from "react";
import { applyDiscountService } from "../../../services/productService";
import { FiEdit2, FiTrash2, FiPercent, FiX } from "react-icons/fi";
import { useTranslation } from "../../../hook/useTranslation";

interface TableProductsProps {
  products: Product[];
}

const TableProducts = ({ products }: TableProductsProps) => {
  const { deleteProduct, getProducts } = useProduct();
  const { t } = useTranslation();
  const [discountInputs, setDiscountInputs] = useState<{ [key: string]: string }>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await deleteProduct(id);
    result.success ? toast.success(result.message) : toast.error(result.message);
  };

  const applyDiscount = async (productId: string) => {
    const discount = parseFloat(discountInputs[productId] || "0");
    if (discount < 0 || discount > 100) { toast.error(t.discountMustBe); return; }
    try {
      await applyDiscountService(productId, discount);
      toast.success(t.discountApplied);
      getProducts();
      setDiscountInputs((prev) => ({ ...prev, [productId]: "" }));
    } catch { toast.error(t.errorApplyingDiscount); }
  };

  const removeDiscount = async (productId: string) => {
    try {
      await applyDiscountService(productId, 0);
      toast.success(t.discountRemoved);
      getProducts();
    } catch { toast.error(t.errorCancelingDiscount); }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 text-center w-10">#</th>
              <th className="px-4 py-3 text-left">{t.tableProduct}</th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">{t.tableDescription}</th>
              <th className="px-4 py-3 text-right">{t.tablePrice}</th>
              <th className="px-4 py-3 text-center">{t.tableDiscount}</th>
              <th className="px-4 py-3 text-center">{t.tableStock}</th>
              <th className="px-4 py-3 text-center">{t.tableActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product, index) => (
              <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-center text-slate-400 font-medium">{index + 1}</td>

                {/* Product */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.images?.[0] && (
                      <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200" />
                    )}
                    <span className="font-semibold text-slate-800 line-clamp-2 max-w-[160px]">{product.name}</span>
                  </div>
                </td>

                {/* Description */}
                <td className="px-4 py-3 hidden lg:table-cell max-w-xs">
                  <span className="text-slate-500 truncate block" title={product.description}>{product.description}</span>
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-right">
                  {(product.discountPercentage ?? 0) > 0 ? (
                    <div className="flex flex-col items-end">
                      <span className="line-through text-slate-400 text-xs">${product.price.toFixed(2)}</span>
                      <span className="font-bold text-blue-600">${(product.discountedPrice ?? product.price).toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="font-semibold text-slate-800">${product.price.toFixed(2)}</span>
                  )}
                </td>

                {/* Discount */}
                <td className="px-4 py-3">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <input
                        type="number" min="0" max="100"
                        className="w-14 px-2 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        value={discountInputs[product._id] || ""}
                        onChange={(e) => setDiscountInputs((prev) => ({ ...prev, [product._id]: e.target.value }))}
                      />
                      <button
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        onClick={() => applyDiscount(product._id)}
                        title={t.apply}
                      >
                        <FiPercent size={12} />
                      </button>
                    </div>
                    {(product.discountPercentage ?? 0) > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          -{product.discountPercentage}%
                        </span>
                        <button
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          onClick={() => removeDiscount(product._id)}
                          title={t.cancel}
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </td>

                {/* Stock */}
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                    product.stock === 0 ? "bg-red-100 text-red-700" :
                    product.stock <= 5 ? "bg-amber-100 text-amber-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>
                    {product.stock === 0 ? t.outOfStock : product.stock}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      to={`/admin/dashboard/products/updateProduct/${product._id}`}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                      title={t.updateProduct}
                    >
                      <FiEdit2 size={15} />
                    </Link>
                    <button
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      onClick={() => { setProductToDelete(product._id); setShowClearConfirm(true); }}
                      title="Delete"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <FiTrash2 className="text-red-600" size={20} />
              </div>
              <h3 className="font-bold text-slate-800">{t.deleteProductConfirm}</h3>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                onClick={() => { setShowClearConfirm(false); setProductToDelete(null); }}
              >
                {t.cancel}
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                onClick={async () => {
                  if (productToDelete) await handleDelete(productToDelete);
                  setShowClearConfirm(false);
                  setProductToDelete(null);
                }}
              >
                {t.yesDeleteProduct}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableProducts;
