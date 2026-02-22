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
      console.log("🔵 [CHECKOUT] Datos del formulario recibidos:", data);
      console.log("🔵 [CHECKOUT] Carrito actual:", cart);

      // Prepara los datos para el backend en formato MercadoPago
      const orderData = {
        items: cart.map((item) => ({
          id: item._id,
          title: item.name,
          unit_price: item.discountedPrice || item.price,
          quantity: item.quantity || 1,
          currency_id: "ARS", // Ajusta según tu moneda
        })),
        payer: {
          email: data.email,
        },
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

      console.log(
        "🔵 [CHECKOUT] Datos que se enviarán al backend:",
        JSON.stringify(orderData, null, 2),
      );

      const response = await createOrder(orderData);

      console.log("🔵 [CHECKOUT] Respuesta del backend:", response);

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Checkout
        </h1>
        <p className="text-gray-600">Complete your purchase securely</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              1
            </div>
            <span className="ml-2 text-sm md:text-base font-medium text-blue-600">
              Shipping
            </span>
          </div>
          <div className="w-12 md:w-20 h-1 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
              2
            </div>
            <span className="ml-2 text-sm md:text-base font-medium text-gray-600">
              Payment
            </span>
          </div>
          <div className="w-12 md:w-20 h-1 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
              3
            </div>
            <span className="ml-2 text-sm md:text-base font-medium text-gray-600">
              Confirm
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            Shipping Information
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
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
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.firstName
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  type="text"
                  placeholder="Enter your first name"
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
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
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.lastName
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  type="text"
                  placeholder="Enter your last name"
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
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
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                type="email"
                placeholder="your.email@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
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
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.phone
                    ? "border-red-400 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                type="tel"
                placeholder="+1 (555) 000-0000"
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> {errors.phone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
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
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.address?.street
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  type="text"
                  placeholder="123 Main Street"
                  autoComplete="address"
                />
                {errors.address?.street && (
                  <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.address.street.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number <span className="text-red-500">*</span>
                </label>
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
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.address?.number
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  type="text"
                  placeholder="456"
                  autoComplete="address"
                />
                {errors.address?.number && (
                  <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.address.number.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
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
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.address?.city
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  type="text"
                  placeholder="New York"
                  autoComplete="address"
                />
                {errors.address?.city && (
                  <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.address.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State/Province <span className="text-red-500">*</span>
                </label>
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
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.address?.state
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  type="text"
                  placeholder="California"
                  autoComplete="address"
                />
                {errors.address?.state && (
                  <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.address.state.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Zip/Postal Code <span className="text-red-500">*</span>
              </label>
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
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.address?.zipCode
                    ? "border-red-400 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                type="text"
                placeholder="10001"
                autoComplete="postal-code"
              />
              {errors.address?.zipCode && (
                <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> {errors.address.zipCode.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing...
                </span>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-start gap-3 pb-4 border-b border-gray-200 last:border-0"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity || 1}
                      </p>
                      {item.discountPercentage &&
                        item.discountPercentage > 0 && (
                          <span className="inline-block mt-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                            -{item.discountPercentage}% OFF
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="text-right">
                    {item.discountPercentage && item.discountPercentage > 0 ? (
                      <>
                        <span className="text-sm line-through text-gray-500 block">
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </span>
                        <span className="font-bold text-blue-600">
                          $
                          {(
                            (item.discountedPrice || item.price) *
                            (item.quantity || 1)
                          ).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-900">
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Shipping:</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="border-t border-blue-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-lg">🔒</span>
                <span className="font-medium">
                  Secure checkout powered by Mercado Pago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
