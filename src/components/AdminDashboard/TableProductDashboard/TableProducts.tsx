import { Link } from "react-router";
import { useProduct } from "../../../context/useProduct";
import toast from "react-hot-toast";
import type { Product } from "../../../interfaces/Product";
import { useState } from "react";
import { applyDiscountService } from "../../../services/productService";
import { FiEdit2, FiTrash2, FiPercent } from "react-icons/fi";
import { useTranslation } from "../../../hook/useTranslation";

interface TableProductsProps {
  products: Product[];
}

const TableProducts = ({ products }: TableProductsProps) => {
  const { deleteProduct, getProducts } = useProduct();
  const { t } = useTranslation();
  const [discountInputs, setDiscountInputs] = useState<{
    [key: string]: string;
  }>({});

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await deleteProduct(id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleDiscountChange = (productId: string, value: string) => {
    setDiscountInputs((prev) => ({ ...prev, [productId]: value }));
  };

  const applyDiscount = async (productId: string) => {
    const discount = parseFloat(discountInputs[productId] || "0");
    if (discount < 0 || discount > 100) {
      toast.error(t.discountMustBe);
      return;
    }

    try {
      await applyDiscountService(productId, discount);
      toast.success(t.discountApplied);
      getProducts();
      setDiscountInputs((prev) => ({ ...prev, [productId]: "" }));
    } catch (error) {
      console.error(error);
      toast.error(t.errorApplyingDiscount);
    }
  };

  const removeDiscount = async (productId: string) => {
    try {
      await applyDiscountService(productId, 0);
      toast.success(t.discountRemoved);
      getProducts();
    } catch (error) {
      console.error(error);
      toast.error(t.errorCancelingDiscount);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <tr>
            <th className="text-center">#</th>
            <th>{t.tableProduct}</th>
            <th className="hidden lg:table-cell">{t.tableDescription}</th>
            <th>{t.tablePrice}</th>
            <th>{t.tableDiscount}</th>
            <th className="text-center">{t.tableStock}</th>
            <th className="hidden xl:table-cell">{t.tableImageUrl}</th>
            <th className="text-center" colSpan={2}>
              {t.tableActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: Product, index: number) => (
            <tr
              key={`${product._id}-${index}`}
              className="hover:bg-blue-50 transition-colors"
            >
              <td className="text-center font-semibold text-gray-700">
                {index + 1}
              </td>
              <td>
                <div className="font-bold text-gray-900 line-clamp-2">
                  {product.name}
                </div>
              </td>
              <td className="hidden lg:table-cell max-w-xs">
                <div
                  className="truncate text-gray-600"
                  title={product.description}
                >
                  {product.description}
                </div>
              </td>
              <td>
                {(product.discountPercentage ?? 0) > 0 ? (
                  <div className="flex flex-col">
                    <span className="line-through text-gray-500 text-sm">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-blue-600 font-bold">
                      ${(product.discountedPrice ?? product.price).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </td>
              <td>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder=""
                      className="input input-sm w-16 border-2 border-gray-300 focus:border-blue-600 focus:outline-none"
                      value={discountInputs[product._id] || ""}
                      onChange={(e) =>
                        handleDiscountChange(product._id, e.target.value)
                      }
                    />
                    <button
                      className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none p-2"
                      onClick={() => applyDiscount(product._id)}
                      title={t.apply}
                    >
                      {t.apply}
                      <FiPercent />
                    </button>
                  </div>
                  {(product.discountPercentage ?? 0) > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-center">
                        {product.discountPercentage}% OFF
                      </span>
                      <button
                        className="btn btn-xs bg-red-500 hover:bg-red-600 text-white border-none p-2"
                        onClick={() => removeDiscount(product._id)}
                      >
                        {t.cancel}
                      </button>
                    </div>
                  )}
                </div>
              </td>
              <td className="text-center">
                <span
                  className={`p-2 rounded-full text-sm font-semibold whitespace-nowrap  ${
                    product.stock === 0
                      ? "bg-red-100 text-red-700"
                      : product.stock <= 5
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {product.stock === 0 ? t.outOfStock : product.stock}
                </span>
              </td>
              <td className="hidden xl:table-cell max-w-[200px]">
                <div
                  className="truncate text-gray-600 text-sm"
                  title={product.images?.[0] ?? ""}
                >
                  {product.images?.[0] ?? ""}
                </div>
              </td>
              <td className="text-center">
                <Link
                  to={`/admin/dashboard/products/updateProduct/${product._id}`}
                  className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none"
                  title="Edit product"
                >
                  <FiEdit2 />
                </Link>
              </td>

              <td className="text-center">
                <button
                  className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none w-8"
                  // onClick={() => handleDelete(product._id)}
                  onClick={() => {
                    setProductToDelete(product._id);
                    setShowClearConfirm(true);
                  }}
                  title="Delete product"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showClearConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3>{t.deleteProductConfirm}</h3>
            <div className="flex gap-3 justify-end">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowClearConfirm(false);
                  setProductToDelete(null);
                }}
              >
                {t.cancel}
              </button>
              <button
                className="btn bg-red-500 hover:bg-red-600 text-white p-2"
                onClick={async () => {
                  if (productToDelete) {
                    await handleDelete(productToDelete);
                  }
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
    </div>
  );
};

export default TableProducts;
