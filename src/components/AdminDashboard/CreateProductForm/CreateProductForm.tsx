import { useForm } from "react-hook-form";
import { useProduct } from "../../../context/useProduct";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import type { Product } from "../../../interfaces/Product";
import { FiPackage, FiDollarSign, FiImage, FiFileText } from "react-icons/fi";

type ProductFormData = Omit<Product, "_id">;

const CreateProductForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({ mode: "onChange" });

  const { createProduct } = useProduct();
  const navigate = useNavigate();

  const onSubmit = async (data: ProductFormData) => {
    const result = await createProduct(data);

    if (result.success) {
      toast.success(result.message);
      reset();
      navigate("/admin/dashboard/products");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 flex flex-col gap-6 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg"
    >
      {/* Product Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FiPackage className="text-blue-600" />
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name", {
            required: "Product name is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
            maxLength: { value: 50, message: "Maximum 50 characters" },
          })}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
            errors.name
              ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          } focus:outline-none`}
          type="text"
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            ❌ {errors.name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FiFileText className="text-blue-600" />
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description", {
            required: "Description is required",
            minLength: { value: 10, message: "Minimum 10 characters" },
            maxLength: { value: 254, message: "Maximum 254 characters" },
          })}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors resize-none ${
            errors.description
              ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          } focus:outline-none`}
          rows={4}
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            ❌ {errors.description.message}
          </p>
        )}
      </div>

      {/* Price and Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FiDollarSign className="text-green-600" />
            Price <span className="text-red-500">*</span>
          </label>
          <input
            {...register("price", {
              required: "Price is required",
              min: { value: 1, message: "Price must be greater than 0" },
            })}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
              errors.price
                ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            } focus:outline-none`}
            type="number"
            step="0.01"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              ❌ {errors.price.message}
            </p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FiPackage className="text-orange-600" />
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            {...register("stock", {
              required: "Stock is required",
              min: { value: 0, message: "Stock must be 0 or greater" },
            })}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
              errors.stock
                ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            } focus:outline-none`}
            type="number"
            placeholder="0"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              ❌ {errors.stock.message}
            </p>
          )}
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FiImage className="text-purple-600" />
          Image URL <span className="text-red-500">*</span>
        </label>
        <input
          {...register("imageUrl", {
            required: "Image URL is required",
          })}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
            errors.imageUrl
              ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          } focus:outline-none`}
          type="text"
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            ❌ {errors.imageUrl.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        type="submit"
      >
        <FiPackage className="text-xl" />
        Create Product
      </button>
    </form>
  );
};

export default CreateProductForm;
