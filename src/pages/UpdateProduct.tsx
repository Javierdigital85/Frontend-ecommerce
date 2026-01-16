import UpdateProductForm from "../components/AdminDashboard/UpdateProductForm/UpdateProductForm";
import { useParams } from "react-router";
import { useProduct } from "../context/useProduct";
import { useEffect } from "react";

const UpdateProduct = () => {
  const { id } = useParams();
  console.log("este es el id", id);

  const { getProductById, product, productLoading } = useProduct();

  useEffect(() => {
    if (id) {
      getProductById(id);
    }
  }, [id, getProductById]);

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
        <p className="text-xl">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-10">
        Actualizar producto
      </h1>
      <UpdateProductForm product={product} />
    </div>
  );
};

export default UpdateProduct;
