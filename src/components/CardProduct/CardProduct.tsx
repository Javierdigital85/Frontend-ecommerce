import { Link } from "react-router";
import { useCart } from "../../context/useCart";
import { FaShoppingCart } from "react-icons/fa";
import type { CardProductProps } from "../../interfaces/Product";

const CardProduct = ({ product }: CardProductProps) => {
  const { name, price, imageUrl, description, _id, stock } = product;
  const { addToCart, loading, openModal } = useCart();

  const handleAddToCart = async () => {
    await addToCart({ _id, name, price, imageUrl, description, stock, quantity: 1 }, 1);
    openModal(); // Abrir el modal del carrito despues de agreagar el producto
    console.log("agregado al carrito?????");
  };

  console.log(name, price, imageUrl);

  return (
    <div className="card bg-base-100 w-80 lg:w-[35%] shadow-lg">
      <figure>
        <img className="aspect-[9/9]" src={imageUrl} alt="games" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <div className="badge badge-warning">{price}</div>
        <p>{description}</p>
        <div className="card-actions justify-between mt-4">
          <Link
            to={`/detailProduct/${_id}`}
            className="btn btn-info btn-sm md:btn-md"
          >
            Ver detalles
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={loading || stock === 0}
            className="btn bg-success text-success-content hover:brightness-90 btn-sm md:btn-md p-2"
          >
            <FaShoppingCart size={16} />
            {stock === 0 ? "Sin Stock" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
