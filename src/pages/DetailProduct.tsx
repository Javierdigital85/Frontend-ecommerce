import { useEffect } from "react";
import { useProduct } from "../context/useProduct";
import { useParams } from "react-router";
import { useCart } from "../context/useCart";

const DetailProduct = () => {
  const { id } = useParams();
  const { getProductById, product, productLoading } = useProduct();
  const { addToCart, openModal } = useCart();

  useEffect(() => {
    getProductById(id);
  }, [id, getProductById]);

  const handleAddToCart = async () => {
    await addToCart(product);
    openModal();
  };

  return (
    <>
      {productLoading ? (
        <div className="loading loading-spinner"></div>
      ) : (
        <div className="mt-6 md:flex md:gap-8 ">
          <div className="md:w-1/2">
            <img src={product.imageUrl} alt={product.name} />
          </div>
          <section className="flex flex-col gap-5 pt-2 md:pt-0 md:pl-0 md:w-1/2">
            <h1 className="text-5xl font-bold">{product.name}</h1>
            <p className="text-xl badge badge-warning p-4 font-bold">
              {product.price}
            </p>
            <p className="text-lg">{product.description}</p>
            <button
              onClick={handleAddToCart}
              className="btn bg-success text-success-content hover:brightness-90 btn-sm md:btn-md p-2"
            >
              Agregar al carrito
            </button>
          </section>
        </div>
      )}
    </>
  );
};

export default DetailProduct;
