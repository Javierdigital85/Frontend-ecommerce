import { Link } from "react-router";
import { useProduct } from "../../../context/useProduct";
import toast from "react-hot-toast";
import type { Product } from "../../../interfaces/Product";

interface TableProductsProps {
  products: Product[];
}

const TableProducts = ({ products }: TableProductsProps) => {
  const { deleteProduct } = useProduct();

  const handleDelete = async (id: string) => {
    const result = await deleteProduct(id);

    console.log("result", result);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
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
            <td>{product.price}</td>
            <td>{product.stock}</td>
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
