import { Link } from "react-router";
import { useCart } from "../../context/useCart";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import type { CardProductProps } from "../../interfaces/Product";
import { useState } from "react";
import { useLanguage } from "../../context/useLanguage";
import { useTranslation } from "../../hook/useTranslation";

const CardProduct = ({ product }: CardProductProps) => {
  const {
    name,
    price,
    imageUrl,
    description,
    _id,
    stock,
    discountPercentage,
    discountedPrice,
  } = product;
  const { addToCart, loading } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const { language } = useLanguage();
  console.log("Current language:", language);
  const handleAddToCart = async () => {
    await addToCart(
      {
        _id,
        name,
        price: discountedPrice || price,
        imageUrl,
        description,
        stock,
        quantity: 1,
      },
      1,
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const finalPrice = discountedPrice || price;
  const hasDiscount = (discountPercentage ?? 0) > 0;
  const { t } = useTranslation();
  return (
    <div className="card bg-white w-full max-w-sm shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 overflow-hidden">
      {/* Imagen */}
      <figure className="relative overflow-hidden bg-gray-50 h-64">
        <Link to={`/detailProduct/${_id}`}>
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="badge bg-red-500 text-white font-bold px-3 py-3 border-0 shadow-lg">
              -{discountPercentage}% OFF
            </span>
          )}
          {stock > 0 && stock <= 5 && (
            <span className="badge bg-orange-500 text-white font-semibold px-3 py-2 border-0">
              {t.onlyLeft} {stock}!
            </span>
          )}
        </div>

        {/* Stock Badge */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="badge badge-lg bg-gray-800 text-white font-bold px-4 py-3 border-0">
              {t.outOfStock}
            </span>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Link
            to={`/detailProduct/${_id}`}
            className="btn btn-sm bg-blue text-gray-900 hover:bg-gray-300 border-0 gap-2"
          >
            <FaEye /> {t.viewDetails}
          </Link>
        </div>
      </figure>

      {/* Contenido */}
      <div className="card-body p-5 gap-3">
        {/* Title */}
        <Link to={`/detailProduct/${_id}`}>
          <h2 className="card-title text-base font-bold line-clamp-2 hover:text-blue-600 transition-colors min-h-[3rem]">
            {language === "en" ? product.name : product.name_es}
          </h2>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
          {language === "en" ? product.description : product.description_es}
        </p>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mt-2">
          {hasDiscount ? (
            <>
              <span className="text-2xl font-bold text-red-600">
                ${finalPrice.toFixed(2)}
              </span>
              <span className="text-base line-through text-gray-400">
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Info */}
        {stock > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <FiCheck className="text-green-600" />
            <span className="text-green-600 font-medium">
              {stock > 10 ? `` : `${stock}`} {t.availableStock}
            </span>
          </div>
        )}

        {/* Acciones */}
        <div className="card-actions flex-col gap-2 mt-3">
          <button
            onClick={handleAddToCart}
            disabled={loading || stock === 0 || isAdded}
            className={`btn w-full border-0 transition-all duration-200 ${
              isAdded
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
              <>
                <FiCheck size={18} />
                {t.addedToCart}
              </>
            ) : (
              <>
                <FaShoppingCart size={16} />
                {t.addToCart}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
