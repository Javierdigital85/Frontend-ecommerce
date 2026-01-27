import CardProduct from "../components/CardProduct/CardProduct";
import { useProduct } from "../context/useProduct";

const Home = () => {
  const { products, productsLoading, error } = useProduct();

  console.log("LOS PRODUCTOS", products);


  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-7xl mx-auto px-4 mt-4">
        {productsLoading ? (
          <div className="loading loading-spinner"></div>
        ) : error ? (
          <p>Error al cargar los productos</p>
        ) : (
          products.map((product) => (
            <CardProduct product={product} key={product._id} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
