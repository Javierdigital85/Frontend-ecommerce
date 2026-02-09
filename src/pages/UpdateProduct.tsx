import UpdateProductForm from "../components/AdminDashboard/UpdateProductForm/UpdateProductForm";
import { useParams } from "react-router";
import { useProduct } from "../context/useProduct";
import { useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";

const UpdateProduct = () => {
  const { id } = useParams();

  const { getProductById, product, productLoading } = useProduct();

  useEffect(() => {
    if (id) {
      getProductById(id);
    }
  }, [id, getProductById]);

  if (productLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
        <p className="text-gray-600 mt-4">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</p>
        <p className="text-gray-600">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <FiEdit2 className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Update Product</h1>
          <p className="text-gray-600">Edit product information and inventory</p>
        </div>

        {/* Form */}
        <UpdateProductForm product={product} />
      </div>
    </div>
  );
};

export default UpdateProduct;

