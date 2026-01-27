import { Link } from "react-router";
import { useCart } from "../../context/useCart";
import { FaShoppingCart } from "react-icons/fa";
import type { CardProductProps } from "../../interfaces/Product";

const CardProduct = ({ product }: CardProductProps) => {
  const { name, price, imageUrl, description, _id, stock, discountPercentage, discountedPrice } = product;
  const { addToCart, loading, openModal } = useCart();

  const handleAddToCart = async () => {
    await addToCart(
      { _id, name, price: discountedPrice || price, imageUrl, description, stock, quantity: 1 },
      1,
    );
    openModal(); // Abrir el modal del carrito despues de agreagar el producto
    console.log("agregado al carrito?????");
  };

  console.log(name, price, imageUrl);

  return (
    <div className="card bg-base-100 w-full max-w-sm shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Imagen */}
      <figure className="relative overflow-hidden bg-base-200">
        <img
          src={imageUrl}
          alt={name}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {(discountPercentage ?? 0) > 0 && (
          <span className="absolute top-3 left-3 badge badge-error text-white font-bold">
           Now -{discountPercentage}%
          </span>
        )}
      </figure>

      {/* Contenido */}
      <div className="card-body gap-3">
        <div className="flex display-flex justify-between">
          <h2 className="card-title text-lg font-semibold line-clamp-1">
            {name}
          </h2>
          <span
            className={
              stock > 0
                ? "text-success font-semibold badge"
                : "text-error font-semibold badge top-3 right-3"
            }
          >
            {stock > 0 ? (
              <>
                <span className="text-sm text-base-content/70">In stock</span>
                <span className="stock-number text-success font-bold text-lg">
                  {stock}
                </span>
              </>
            ) : (
              "Out of stock"
            )}
          </span>
        </div>

        <div className="flex flex-col">
          {(discountPercentage ?? 0) > 0 ? (
            <>
              <span className="text-lg line-through text-base-content/50">${price}</span>
              <span className="text-2xl font-bold text-error">${discountedPrice}</span>
            </>
          ) : (
            <span className="text-2xl font-bold text-success">${price}</span>
          )}
        </div>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {description}
        </p>

        {/* Acciones */}
        <div className="card-actions justify-between items-center mt-4">
          <Link
            to={`/detailProduct/${_id}`}
            className="btn bg-base-300 text-base-content hover:brightness-95 btn-sm md:btn-md p-2"
          >
            Ver detalles
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={loading || stock === 0}
            className="btn btn-success bg-success text-success-content hover:brightness-90 btn-sm md:btn-md p-2  disabled:opacity-50"
          >
            <FaShoppingCart size={16} />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
