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
import { useState } from "react";
import { uploadImage, uploadVideo } from "../../../services/uploadService";

const UpdateProductForm = ({ product }: UpdateProductFormProps) => {
  const { updateProduct } = useProduct();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [imageType, setImageType] = useState<"none" | "upload" | "url">("none");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageList, setImageList] = useState<string[]>(product.images || []);
  const [urlInput, setUrlInput] = useState("");
  const [videoType, setVideoType] = useState<"none" | "upload" | "youtube">(
    "none",
  );
  const [videoUploading, setVideoUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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

      {/* Images */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <FiImage className="text-purple-600" />
          {t.tableImageUrl} <span className="text-red-500">*</span>
        </label>

        {/* Current images preview */}
        {imageList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {imageList.map((img, index) => (
              <div key={index} className="relative w-20 h-20">
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = imageList.filter((_, i) => i !== index);
                    setImageList(updated);
                    setValue("images", updated);
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Buttons to select image input type */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setImageType("none")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${imageType === "none" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Sin imagen
          </button>
          <button
            type="button"
            onClick={() => setImageType("upload")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${imageType === "upload" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Subir imagen
          </button>
          <button
            type="button"
            onClick={() => setImageType("url")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${imageType === "url" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Url imagen
          </button>
        </div>

        {/* File upload input */}
        {imageType === "upload" && (
          <div>
            <input
              type="file"
              accept="image/*"
              disabled={imageUploading}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageUploading(true);
                  try {
                    const url = await uploadImage(file);
                    const updated = [...imageList, url];
                    setImageList(updated);
                    setValue("images", updated);
                  } catch {
                    toast.error("Error al subir la imagen");
                  } finally {
                    setImageUploading(false);
                  }
                }
              }}
            />
            {imageUploading && (
              <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                <span className="loading loading-spinner loading-xs"></span>
                Subiendo imagen a Cloudinary...
              </p>
            )}
          </div>
        )}

        {/* URL input */}
        {imageType === "url" && (
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = urlInput.trim();
                  if (val) {
                    const updated = [...imageList, val];
                    setImageList(updated);
                    setValue("images", updated);
                    setUrlInput("");
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const val = urlInput.trim();
                if (val) {
                  const updated = [...imageList, val];
                  setImageList(updated);
                  setValue("images", updated);
                  setUrlInput("");
                }
              }}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-lg"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Video */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Video del producto
        </label>
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => {
              setVideoType("none");
              setValue("videoUrl", undefined);
              setValue("videoSource", null);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${videoType === "none" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Sin video
          </button>
          <button
            type="button"
            onClick={() => setVideoType("upload")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${videoType === "upload" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Subir video
          </button>
          <button
            type="button"
            onClick={() => setVideoType("youtube")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${videoType === "youtube" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            URL de YouTube
          </button>
        </div>

        {videoType === "upload" && (
          <div>
            <input
              type="file"
              accept="video/*"
              disabled={videoUploading}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setVideoUploading(true);
                  try {
                    const url = await uploadVideo(file);
                    setValue("videoUrl", url);
                    setValue("videoSource", "cloudinary");
                  } finally {
                    setVideoUploading(false);
                  }
                }
              }}
            />
            {videoUploading && (
              <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                <span className="loading loading-spinner loading-xs"></span>
                Subiendo video a Cloudinary...
              </p>
            )}
          </div>
        )}

        {videoType === "youtube" && (
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            onChange={(e) => {
              setValue("videoUrl", e.target.value);
              setValue("videoSource", "youtube");
            }}
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        disabled={videoUploading || imageUploading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
      >
        <FiSave className="text-xl" />
        {t.updateProduct}
      </button>
    </form>
  );
};

export default UpdateProductForm;
