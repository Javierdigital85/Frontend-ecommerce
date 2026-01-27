import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "../context/useCart";
import { useUser } from "../context/useUser";
import { createOrder } from "../services/orderService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import type { ShippingInfo } from "../interfaces/Order";

const Checkout = () => {
  const { cart, total, loading: cartLoading } = useCart();
  const { userInfo, isAuthenticated, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Verificar autenticación - redirigir a login si no está autenticado
  useEffect(() => {
    if (!userLoading && !isAuthenticated()) {
      toast.error("Debes iniciar sesión para continuar con la compra");
      // Guardar la ruta actual para redirigir después del login
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [userLoading, isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingInfo>({
    defaultValues: {
      firstName: userInfo?.username || "",
      lastName: "",
      email: userInfo?.email || "",
      phone: "",
      address: {
        street: "",
        number: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
    mode: "onChange",
  });

  // Mostrar loading mientras se verifica la autenticación
  if (userLoading || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (ya redirigió)
  if (!isAuthenticated()) {
    return null;
  }

  const onSubmit = async (data: ShippingInfo) => {
    setLoading(true);

    try {
      // Prepara los datos para el backend
      const orderData = {
        products: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.discountedPrice || item.price,
          quantity: item.quantity || 1,
          imageUrl: item.imageUrl,
        })),
        totalAmount: total,
        shippingInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: {
            street: data.address.street,
            number: data.address.number,
            city: data.address.city,
            state: data.address.state,
            zipCode: data.address.zipCode,
          },
        },
      };

      const response = await createOrder(orderData);

      console.log(response);

      if (response.success && response.paymentUrl) {
        // Mostrar mensage de exito
        toast.success("Orden creada con exito. Redirigiendo a Mercado Pago...");

        // Guardar el carrito en sessionStorage como respaldo
        sessionStorage.setItem("checkoutCart", JSON.stringify(cart));

        // Redirigir a Mercado Pago despues de un breve delay
        setTimeout(() => {
          window.location.href = response.paymentUrl;
        }, 1500);
      } else {
        throw new Error("No se recibio URL de pago");
      }
    } catch {
      toast.error("Error al procesar la orden intente más tarde");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-base-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Información de Envío</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 lg:gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <input
                  {...register("firstName", {
                    required: "El nombre es requerido",
                    minLength: {
                      value: 3,
                      message: "Minimo 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "Maximi 50 caracteres",
                    },
                    pattern: {
                      value: /^[\p{L}\s]+$/u,
                      message: "Solo letras y espacios",
                    },
                  })}
                  className={`p-2 outline-2 border rounded focus:outline-primary w-full ${
                    errors.firstName
                      ? "border-red-400 outline-red-400 focus:outline-red-400"
                      : ""
                  }`}
                  type="text"
                  placeholder="Nombre"
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-2 ml-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("lastName", {
                    required: "El apellido es requerido",
                    minLength: {
                      value: 3,
                      message: "Minimo 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "Maximo 50 caracteres",
                    },
                    pattern: {
                      value: /^[\p{L}\s]+$/u,
                      message: "Solo letras y espacios",
                    },
                  })}
                  className={`p-2 outline-2 border rounded focus:outline-primary w-full ${
                    errors.lastName ? "border-red-400 outline-red-400" : ""
                  }`}
                  type="text"
                  placeholder="Apellido"
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm my-2 ml-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <input
                {...register("email", {
                  required: "El email es requerido",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email invalido",
                  },
                  minLength: {
                    value: 6,
                    message: "Minimo 6 caracteres",
                  },
                  maxLength: {
                    value: 254,
                    message: "Maximo 254 caracteres",
                  },
                })}
                className={`p-2 outline-2 border rounded focus:outline-primary w-full ${
                  errors.email
                    ? "border-red-400 outline-red-400 focus:outline-red-400"
                    : ""
                }`}
                type="email"
                placeholder="Email"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("phone", {
                  required: "El telefono es requerido",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Formato de teléfono inválido",
                  },
                  minLength: {
                    value: 8,
                    message: "Minimo 8 caracteres",
                  },
                  maxLength: {
                    value: 20,
                    message: "Máximo 20 caracteres",
                  },
                })}
                className={`p-2 outline-2 border rounded focus:outline-primary w-full ${
                  errors.phone
                    ? "border-red-400 outline-red-400 focus:outline-red-400"
                    : ""
                }`}
                type="tel"
                placeholder="Teléfono"
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-2 ml-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="md:col-span-2">
                <input
                  {...register("address.street", {
                    required: "La calle es requerida",
                    minLength: {
                      value: 3,
                      message: "Minimo 3 caracteres",
                    },
                    maxLength: {
                      value: 100,
                      message: "Máximo 100 caracteres",
                    },
                  })}
                  className={`p-2 outline-2 border rounded focus:outline-primary w-full ${
                  errors.address?.street
                      ? "border-red-400 outline-red-400 focus:outline-red-400"
                      : ""
                  }`}
                  type="text"
                  placeholder="Calle"
                  autoComplete="address"
                />
                {errors.address?.street && (
                  <p className="text-red-500 text-sm mt-2 ml-1">
                    {errors.address.street.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("address.number", {
                    required: "El número es requerido",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Formato de número inválido",
                    },
                    minLength: {
                      value: 1,
                      message: "Minimo 1 número",
                    },
                    maxLength: {
                      value: 10,
                      message: "Máximo 10 números",
                    },
                  })}
                  className={`p-2 outline-2 border rounded focus:outline-primary w-full ${
                    errors.address?.number
                      ? "border-red-400 outline-red-400 focus:outline-red-400"
                      : ""
                  }`}
                  type="text"
                  placeholder="Número"
                  autoComplete="address"
                />
                {errors.address?.number && (
                  <p className="text-red-500 text-sm mt-2 ml-1">
                    {errors.address.number.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <input
                  {...register("address.city", {
                    required: "La ciudad es requerida",
                    minLength: {
                      value: 3,
                      message: "Minimo 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "Maximo 50 caracteres",
                    },
                    pattern: {
                      value: /^[\p{L}\s]+$/u,
                      message: "Solo letras y espacios",
                    },
                  })}
                  className={`p-2 outline-2 border rounded focus:outline-primary w-full ${
                    errors.address?.city
                      ? "border-red-400 outline-red-400 focus:outline-red-400"
                      : ""
                  }`}
                  type="text"
                  placeholder="Ciudad"
                  autoComplete="address"
                />
                {errors.address?.city && (
                  <p className="text-red-500 text-sm mt-2 ml-1">
                    {errors.address.city.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("address.state", {
                    required: "La provincia es requerida",
                    minLength: {
                      value: 3,
                      message: "Minimo 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "Maximo 50 caracteres",
                    },
                    pattern: {
                      value: /^[\p{L}\s]+$/u,
                      message: "Solo letras y espacios",
                    },
                  })}
                  className={`p-2 outline-2 border rounded focus:outline-primary w-full ${
                    errors.address?.state
                      ? "border-red-400 outline-red-400 focus:outline-red-400"
                      : ""
                  }`}
                  type="text"
                  placeholder="Provincia"
                  autoComplete="address"
                />
                {errors.address?.state && (
                  <p className="text-red-500 text-sm mt-2 ml-1">
                    {errors.address.state.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <input
                {...register("address.zipCode", {
                  required: "El código postal es requerido",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Formato de código postal inválido",
                  },
                  minLength: {
                    value: 4,
                    message: "Minimo 4 caracteres",
                  },
                  maxLength: {
                    value: 10,
                    message: "Máximo 10 caracteres",
                  },
                })}
                className={`p-2 outline-2 border rounded focus:outline-primary w-full ${
                  errors.address?.zipCode
                    ? "border-red-400 outline-red-400 focus:outline-red-400"
                    : ""
                }`}
                type="text"
                placeholder="Código Postal"
                autoComplete="postal-code"
              />
              {errors.address?.zipCode && (
                <p className="text-red-500 text-sm mt-2 ml-1">
                  {errors.address.zipCode.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn bg-blue-600 hover:bg-blue-700 text-white mt-6"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner">Procesando...</span>
                </>
              ) : (
                "Proceder al Pago"
              )}
            </button>
          </form>
        </div>

        {/* Resumen de la orden */}
        <div className="bg-base-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Resumen de la Orden</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Cantidad: {item.quantity || 1}
                    </p>
                    {item.discountPercentage && item.discountPercentage > 0 && (
                      <p className="text-xs text-green-600">
                        Descuento: -{item.discountPercentage}%
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {item.discountPercentage && item.discountPercentage > 0 ? (
                    <>
                      <span className="text-sm line-through text-gray-500 block">
                        ${item.price * (item.quantity || 1)}
                      </span>
                      <span className="font-semibold text-red-600">
                        ${(item.discountedPrice || item.price) * (item.quantity || 1)}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold">
                      ${item.price * (item.quantity || 1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span>${total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
