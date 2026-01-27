import { CgTrash } from "react-icons/cg";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../../context/useCart";
import { Link } from "react-router";

const ModalCart = () => {
  const {
    cart,
    closeModal,
    isModalOpen,
    itemsQuantity,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading,
  } = useCart();

  if (!isModalOpen) return null; //solo renderizara si el modal esta abierto

  return (
    <div className="modal modal-open px-4">
      <section className="modal-box w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Carrito de compras</h3>
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost"
          >
            X
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="text-gray-500 mt-2">Actualizando carrito...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Tu carrito está vacio</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-96 flex flex-col gap-4 overflow-auto rounded p-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center flex-wrap md:flex-row md:items-center gap-4 rounded-lg"
                >
                  <img
                    className="w-20 h-20 object-cover aspect-square"
                    src={item.imageUrl}
                    alt={item.name}
                  />
                  <div className="flex-1 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      {item.discountPercentage && item.discountPercentage > 0 ? (
                        <div className="text-sm">
                          <span className="line-through text-gray-500">${item.price}</span>
                          <span className="text-red-600 font-bold ml-2">${item.discountedPrice}</span>
                          <span className="text-green-600 text-xs ml-1">(-{item.discountPercentage}%)</span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">${item.price}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2 md:mt-0">
                      <div className="flex items-center rounded-lg">
                        <button
                          onClick={async () => {
                            if (item.quantity > 1) {
                              await updateQuantity(item._id, item.quantity - 1);
                            }
                          }}
                          disabled={loading || item.quantity <= 1}
                          className="p-2 border rounded"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="px-4 py-2 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={async () => {
                            await updateQuantity(item._id, item.quantity + 1);
                          }}
                          disabled={
                            loading || item.quantity >= (item.stock || 999)
                          }
                          className="p-2 border rounded"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      {/*Precio subtotal */}
                      <span className="font-semibold text-lg">
                        ${(item.discountedPrice || item.price) * item.quantity}
                      </span>
                      {/* Boton de eiliminar */}
                      <button
                        onClick={async () => {
                          await removeFromCart(item._id);
                        }}
                        disabled={loading}
                        className="btn btn-ghost btn-sm hover:bg-red-50"
                      >
                        <CgTrash size={19} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Resumen del carrito */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span>Total de articulos:</span>
                <span className="font-semibold">{itemsQuantity}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${total}</span>
              </div>
            </div>
            {/* Botones de acción */}
            <div className="modal-action mt-4 flex flex-col lg:flex-row lg:justify-between">
              <button
                onClick={async () => {
                  if (window.confirm("¿Estas seguro de vaciar el carrito?")) {
                    await clearCart();
                  }
                }}
                disabled={loading}
                className="btn bg-error text-error-content hover:brightness-90 px-2"
              >
                Vaciar carrito
              </button>
              <Link className="btn btn-info" onClick={closeModal} to={"/"}>
                Seguir comprando
              </Link>
              <Link
                to={"/checkout"}
                className="btn bg-success text-success-content hover:brightness-90"
                onClick={closeModal}
              >
                Proceder al pago
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Click fuera para cerrar el modal */}
      <div className="modal-backdrop" onClick={closeModal}></div>
    </div>
  );
};

export default ModalCart;
