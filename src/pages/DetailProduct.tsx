import { useEffect, useState } from "react";
import { useProduct } from "../context/useProduct";
import { useParams, Link } from "react-router";
import { useCart } from "../context/useCart";
import {
  FiShoppingCart,
  FiCheck,
  FiChevronRight,
  FiHome,
  FiPackage,
  FiTruck,
  FiShield,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useLanguage } from "../context/useLanguage";
import { useTranslation } from "../hook/useTranslation";

const DetailProduct = () => {
  const { id } = useParams();
  const { getProductById, product, productLoading } = useProduct();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      getProductById(id);
    }
  }, [id, getProductById]);

  useEffect(() => {
    // Reset to top when product loads
    window.scrollTo(0, 0);
  }, [product]);

  const handleAddToCart = async () => {
    if (product) {
      await addToCart({ ...product, quantity }, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  const discountPercentage = product?.discountPercentage || 0;
  const originalPrice = product?.price || 0;
  const finalPrice = product?.discountedPrice || originalPrice;

  const productImages = product?.images ?? [];

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (productLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
          <p className="mt-4 text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <span className="text-4xl">📦</span>
          </div>
          <p className="text-2xl font-bold mb-2 text-gray-800">
            Product not found
          </p>
          <p className="text-gray-500 mb-6">
            The product you're looking for doesn't exist
          </p>
          <Link to="/" className="btn bg-blue-600 hover:bg-blue-700 text-white">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 pb-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-6 text-gray-600">
        <Link
          to="/"
          className="hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <FiHome /> {t.home}
        </Link>
        <FiChevronRight className="text-gray-400" />
        <span className="text-gray-900 font-medium">{t.products}</span>
        <FiChevronRight className="text-gray-400" />
        <span className="text-gray-900 font-medium truncate max-w-xs">
          {language === "es" && product.name_es
            ? product.name_es
            : product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 aspect-square flex items-center justify-center">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4">
                <span className="badge bg-red-500 text-white font-bold px-4 py-3 text-base border-0 shadow-lg">
                  -{discountPercentage}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-3 gap-3">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-blue-600 shadow-md scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Video Player */}
          {product.videoUrl && product.videoUrl !== "null" && product.videoUrl.trim() !== "" && (
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              {product.videoSource === "youtube" ? (
                getYouTubeEmbedUrl(product.videoUrl) && (
                  <iframe
                    src={getYouTubeEmbedUrl(product.videoUrl)!}
                    title="Product video"
                    className="w-full aspect-video"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                )
              ) : (
                <video
                  src={product.videoUrl}
                  controls
                  className="w-full aspect-video bg-black"
                />
              )}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-900 leading-tight">
              {language === "es" && product.name_es
                ? product.name_es
                : product.name}
            </h1>

            {/* Mock Rating */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" size={18} />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                (4.8 - 124 {t.reviews})
              </span>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 items-center">
              {product.stock > 0 ? (
                <div className="badge bg-green-100 text-green-700 border-0 gap-2 px-3 py-3 font-semibold">
                  <FiCheck className="w-4 h-4" />
                  {t.inStock}
                </div>
              ) : (
                <div className="badge bg-red-100 text-red-700 border-0 px-3 py-3 font-semibold">
                  {t.outOfStock}
                </div>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <div className="badge bg-orange-100 text-orange-700 border-0 px-3 py-3 font-semibold">
                  {t.onlyLeft} {product.stock}!
                </div>
              )}
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-4xl lg:text-5xl font-bold text-blue-600">
                ${finalPrice.toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-xl text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-700 font-semibold bg-green-100 px-3 py-1 rounded-full">
                  Save ${(originalPrice - finalPrice).toFixed(2)} (
                  {discountPercentage}% OFF)
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold mb-3 text-gray-900">
              {t.description}
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              {language === "es" ? product.description_es : product.description}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <FiTruck className="text-blue-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {t.freeShipping}
                </h4>
                <p className="text-sm text-gray-600">{t.freeShippingDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <FiShield className="text-blue-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {t.securePayment}
                </h4>
                <p className="text-sm text-gray-600">{t.securePaymentDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <FiPackage className="text-blue-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {t.easyReturns}
                </h4>
                <p className="text-sm text-gray-600">{t.easyReturnsDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <FiCheck className="text-blue-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {t.qualityGuarantee}
                </h4>
                <p className="text-sm text-gray-600">{t.verifiedProducts}</p>
              </div>
            </div>
          </div>

          {/* Stock Info */}
          {product.stock > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-gray-700 font-medium">
                {t.availableStock}:
              </span>
              <span className="font-bold text-xl text-blue-600">
                {product.stock} {t.units}
              </span>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-3">
                  {t.quantity}:
                </label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity === 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center py-3 focus:outline-none font-semibold text-gray-900"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-4 py-3 hover:bg-gray-100 transition font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity === product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedSuccess}
                className={`flex-1 btn border-0 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 gap-2 text-base ${
                  addedSuccess
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
              >
                {addedSuccess ? (
                  <>
                    <FiCheck className="w-5 h-5" />
                    {t.addedToCart}
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="w-5 h-5" />
                    {t.addToCart}
                  </>
                )}
              </button>
            </div>

            {/* Out of Stock Alert */}
            {product.stock === 0 && (
              <div className="alert bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-red-800">Out of Stock</p>
                    <p className="text-sm text-red-600">
                      This product is currently unavailable
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
