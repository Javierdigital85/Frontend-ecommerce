import { useForm } from "react-hook-form";
import { useProduct } from "../../../context/useProduct";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import type {
  Product,
  UpdateProductFormProps,
} from "../../../interfaces/Product";

const UpdateProductForm = ({ product }: UpdateProductFormProps) => {
  const { updateProduct } = useProduct();
  const navigate = useNavigate();

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
      className="mt-8 flex flex-col gap-4 lg:gap-6 max-w-[500px] mx-auto"
    >
      <div>
        <label>Name</label>
        <input
          {...register("name", {
            required: "El nombre es requerido",
            minLength: {
              value: 3,
              message: "Minimo 3 caracteres",
            },
            maxLength: {
              value: 50,
              message: "Maximo 50 caracteres",
            },
          })}
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
            errors.name
              ? "border-red-500 outline-red-500 focus:outline-red-500"
              : ""
          }`}
          type="text"
          placeholder="Nombre"
          name="name"
          autoComplete="name"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-2 ml-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label>Description</label>
        <input
          {...register("description", {
            required: "La descripción es requerida",
            minLength: {
              value: 10,
              message: "Minimo 10 caracteres",
            },
            maxLength: {
              value: 254,
              message: "Maximo 254 caracteres",
            },
          })}
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
            errors.description
              ? "border-red-500 outline-red-500 focus:outline-red-500"
              : ""
          }`}
          type="text"
          placeholder="Descripción"
          name="description"
          autoComplete="description"
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-2 ml-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label>Price</label>
        <input
          {...register("price", {
            required: "El precio es requerido",
            min: {
              value: 2,
              message: "El precio debe ser mayor a 1",
            },
          })}
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
            errors.price
              ? "border-red-500 outline-red-500 focus:outline-red-500"
              : ""
          }`}
          type="number"
          placeholder="Precio"
          name="price"
          autoComplete="price"
        />
        {errors.price && (
          <p className="text-red-400 text-sm mt-2 ml-1">
            {errors.price.message}
          </p>
        )}
      </div>

      <div>
        <label>Stock</label>
        <input
          {...register("stock", {
            required: "El stock es requerido",
            min: {
              value: 0,
              message: "El stock minimo debe ser mayor o igual a 0",
            },
          })}
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
            errors.stock
              ? "border-red-500 outline-red-500 focus:outline-red-500"
              : ""
          }`}
          type="number"
          placeholder="Stock"
          name="stock"
          autoComplete="stock"
        />
        {errors.stock && (
          <p className="text-red-400 text-sm mt-2 ml-1">
            {errors.stock.message}
          </p>
        )}
      </div>

      <div>
        <label>Url image</label>
        <input
          {...register("imageUrl", {
            required: "La url de la imagen es requerida",
          })}
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
            errors.imageUrl
              ? "border-red-500 outline-red-500 focus:outline-red-500"
              : ""
          }`}
          type="text"
          placeholder="Imagen"
          name="imageUrl"
          autoComplete="imageUrl"
        />
        {errors.imageUrl && (
          <p className="text-red-400 text-sm mt-2 ml-1">
            {errors.imageUrl.message}
          </p>
        )}
      </div>
      <button
        className="btn bg-blue-600 hover:bg-blue-700 text-white"
        type="submit"
      >
        Actualizar producto
      </button>
    </form>
  );
};

export default UpdateProductForm;
