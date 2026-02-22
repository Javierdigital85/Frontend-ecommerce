import { useForm } from "react-hook-form";
import { useProduct } from "../../../context/useProduct";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import type {
  Product,
  UpdateProductFormProps,
} from "../../../interfaces/Product";
import {
  FiPackage,
  FiDollarSign,
  FiImage,
  FiFileText,
  FiSave,
} from "react-icons/fi";
import { useTranslation } from "../../../hook/useTranslation";

const UpdateProductForm = ({ product }: UpdateProductFormProps) => {
  const { updateProduct } = useProduct();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>({ mode: "onChange", defaultValues: product });

  const onSubmit = async (data: Product) => {
    const result = await updateProduct(product._id, data);

    if (result.success) {
      toast.success(result.message);
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
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <FiPackage className="text-blue-600" />
          {t.productName} <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name", {
            required: t.productNameRequired,
            minLength: { value: 3, message: t.usernameMinLength },
            maxLength: { value: 50, message: t.usernameMaxLength },
          })}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
            errors.name
              ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          } focus:outline-none`}
          type="text"
          placeholder={t.enterProductName}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            ❌ {errors.name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <FiFileText className="text-blue-600" />
          {t.description} <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description", {
            required: t.descriptionRequired,
            minLength: { value: 10, message: t.usernameMinLength },
            maxLength: { value: 254, message: t.passwordMaxLength },
          })}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors resize-none ${
            errors.description
              ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          } focus:outline-none`}
          rows={4}
          placeholder={t.enterProductDescription}
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
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FiDollarSign className="text-green-600" />
            {t.priceLabel} <span className="text-red-500">*</span>
          </label>
          <input
            {...register("price", {
              required: t.priceRequired,
              min: { value: 2, message: t.priceMinUpdate },
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
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FiPackage className="text-orange-600" />
            {t.tableStock} <span className="text-red-500">*</span>
          </label>
          <input
            {...register("stock", {
              required: t.stockRequired,
              min: { value: 0, message: t.stockMin },
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
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <FiImage className="text-purple-600" />
          {t.tableImageUrl} <span className="text-red-500">*</span>
        </label>
        <input
          {...register("imageUrl", {
            required: t.imageUrlRequired,
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
        <FiSave className="text-xl" />
        {t.updateProduct}
      </button>
    </form>
  );
};

export default UpdateProductForm;
