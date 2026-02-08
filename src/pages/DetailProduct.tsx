import { useEffect, useState } from "react";
import { useProduct } from "../context/useProduct";
import { useParams } from "react-router";
import { useCart } from "../context/useCart";
import { FiShoppingCart, FiCheck } from "react-icons/fi";

const DetailProduct = () => {
  const { id } = useParams();
  const { getProductById, product, productLoading } = useProduct();
  const { addToCart, openModal } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      getProductById(id);
    }
  }, [id, getProductById]);

  const handleAddToCart = async () => {
    if (product) {
      await addToCart({ ...product, quantity }, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
      openModal();
    }
  };

  const discountPercentage = product?.discountPercentage || 0;
  const originalPrice = product?.price || 0;
  const finalPrice = product?.discountedPrice || originalPrice;

  if (productLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-2xl font-bold mb-2">Producto no encontrado</p>
          <p className="text-gray-500">El producto que buscas no existe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Imagen del producto */}
        <div className="flex items-center justify-center bg-base-200 rounded-lg overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Detalles del producto */}
        <div className="flex flex-col gap-6">
          {/* Nombre y badges */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {product.name}
            </h1>
            <div className="flex gap-2 items-center">
              {product.stock > 0 ? (
                <div className="badge badge-success gap-1">
                  <FiCheck className="w-4 h-4" />
                  En Stock
                </div>
              ) : (
                <div className="badge badge-error">Agotado</div>
              )}
              {discountPercentage > 0 && (
                <div className="badge badge-warning">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Precios */}
          <div className="bg-base-200 p-6 rounded-lg">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-success">
                ${finalPrice.toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-xl text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <p className="text-sm text-success mt-2 font-semibold">
                Save ${(originalPrice - finalPrice).toFixed(2)}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock info */}
          <div className="divider my-2"></div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Disponibles:</span>
            <span className="font-bold text-lg">{product.stock} unidades</span>
          </div>

          {/* Cantidad y agregar al carrito */}
          <div className="flex gap-4 items-center pt-4">
            <div className="flex items-center border border-base-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-base-200 transition"
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
                className="w-16 text-center border-l border-r border-base-300 py-2 focus:outline-none"
                min="1"
                max={product.stock}
              />
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="px-4 py-2 hover:bg-base-200 transition"
                disabled={quantity === product.stock}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addedSuccess}
              className="btn btn-success bg-success text-success-content hover:brightness-90 btn-sm md:btn-md p-2 disabled:opacity-50 flex-1 gap-2"
            >
              {addedSuccess ? (
                <>
                  <FiCheck className="w-5 h-5" />
                  Agregado
                </>
              ) : (
                <>
                  <FiShoppingCart className="w-5 h-5" />
                  Agregar al carrito
                </>
              )}
            </button>
          </div>

          {product.stock === 0 && (
            <div className="alert alert-error">
              <p className="text-sm">
                Este producto no está disponible en este momento
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
