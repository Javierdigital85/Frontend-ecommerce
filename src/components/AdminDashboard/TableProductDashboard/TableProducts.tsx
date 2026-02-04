import { Link } from "react-router";
import { useProduct } from "../../../context/useProduct";
import toast from "react-hot-toast";
import type { Product } from "../../../interfaces/Product";
import { useState } from "react";
import { applyDiscountService } from "../../../services/productService";

interface TableProductsProps {
  products: Product[];
}

const TableProducts = ({ products }: TableProductsProps) => {
  const { deleteProduct, getProducts } = useProduct();
  const [discountInputs, setDiscountInputs] = useState<{
    [key: string]: string;
  }>({});

  const handleDelete = async (id: string) => {
    const result = await deleteProduct(id);

    console.log("result", result);
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
      toast.error("El descuento debe estar entre 0 y 100");
      return;
    }

    try {
      await applyDiscountService(productId, discount);
      toast.success("Descuento aplicado exitosamente");
      getProducts();
      setDiscountInputs((prev) => ({ ...prev, [productId]: "" }));
    } catch (error) {
      console.error(error);
      toast.error("Error al aplicar descuento");
    }
  };

  return (
    <table className="table text-center">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th className="max-w-xs">Description</th>
          <th>Price</th>
          <th>Discount</th>
          <th>Stock</th>
          <th className="max-w-[200px]">Image</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product: Product, index: number) => (
          <tr key={`${product._id}-${index}`}>
            <td>{index + 1}</td>
            <td>{product.name}</td>
            <td className="max-w-xs">
              <div className="truncate" title={product.description}>
                {product.description}
              </div>
            </td>
            <td>
              {(product.discountPercentage ?? 0) > 0 ? (
                <div>
                  <span className="line-through text-gray-500">
                    ${product.price}
                  </span>
                  <br />
                  <span className="text-red-600 font-bold">
                    ${product.discountedPrice}
                  </span>
                </div>
              ) : (
                `$${product.price}`
              )}
            </td>
            <td>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="%"
                  className="input input-sm w-16 border"
                  value={discountInputs[product._id] || ""}
                  onChange={(e) =>
                    handleDiscountChange(product._id, e.target.value)
                  }
                />
                <button
                  className="btn bg-green-600 hover:bg-green-700 text-white px-2"
                  onClick={() => applyDiscount(product._id)}
                >
                  Apply
                </button>
              </div>
              {(product.discountPercentage ?? 0) > 0 && (
                <div className="text-xs text-green-600 mt-1">
                  {product.discountPercentage}% OFF
                </div>
              )}
            </td>
            <td
              className={
                product.stock === 0
                  ? "text-red-500 font-bold"
                  : "text-green-600"
              }
            >
              {product.stock === 0 ? "No stock" : `${product.stock}`}
            </td>
            <td className="max-w-[200px]">
              <div className="truncate" title={product.imageUrl}>
                {product.imageUrl}
              </div>
            </td>
            <td>
              <Link
                to={`/admin/dashboard/products/updateProduct/${product._id}`}
                className="btn btn-info"
              >
                Edit
              </Link>
            </td>
            <td>
              <button
                className="btn bg-error text-error-content hover:brightness-90 px-2"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableProducts;
