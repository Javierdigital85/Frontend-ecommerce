import { CgTrash } from "react-icons/cg";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useCart } from "../../context/useCart";
import { Link } from "react-router";
import { useState } from "react";

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

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isModalOpen) return null;

  return (
    <div className="modal modal-open px-4 animate-fadeIn">
      <section className="modal-box w-full max-w-3xl p-0 overflow-hidden animate-slideIn">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <FaShoppingCart className="text-2xl" />
            <div>
              <h3 className="font-bold text-xl">Shopping Cart</h3>
              <p className="text-sm text-blue-100">
                {itemsQuantity} {itemsQuantity === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle bg-white/20 hover:bg-white/30 border-0 text-white"
          >
            <FiX size={20} />
          </button>
        </div>
        {loading ? (
          <div className="text-center py-16 px-6">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
            <p className="text-gray-600 mt-4 font-medium">Updating cart...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="text-6xl mb-4">🛒</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h4>
            <p className="text-gray-500 mb-6">
              Add some products to get started!
            </p>
            <Link
              to="/"
              onClick={closeModal}
              className="btn bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="max-h-96 overflow-auto p-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <img
                    className="w-24 h-24 object-cover rounded-lg border-2 border-white shadow-sm"
                    src={item.imageUrl}
                    alt={item.name}
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="mb-3">
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {item.name}
                      </h4>
                      {item.discountPercentage &&
                      item.discountPercentage > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="line-through text-gray-500 text-sm">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-blue-600 font-bold">
                            ${(item.discountedPrice || item.price).toFixed(2)}
                          </span>
                          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                            {item.discountPercentage}% OFF
                          </span>
                        </div>
                      ) : (
                        <p className="text-blue-600 font-bold">
                          ${item.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={async () => {
                            if (item.quantity > 1) {
                              await updateQuantity(item._id, item.quantity - 1);
                            }
                          }}
                          disabled={loading || item.quantity <= 1}
                          className="p-2 hover:bg-gray-200 transition disabled:opacity-50"
                        >
                          <FaMinus size={12} className="text-gray-700" />
                        </button>
                        <span className="px-3 md:px-4 py-2 font-bold text-gray-900 min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={async () => {
                            await updateQuantity(item._id, item.quantity + 1);
                          }}
                          disabled={
                            loading || item.quantity >= (item.stock || 999)
                          }
                          className="p-2 hover:bg-gray-200 transition disabled:opacity-50"
                        >
                          <FaPlus size={12} className="text-gray-700" />
                        </button>
                      </div>
                      {/* Subtotal and Delete */}
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="font-bold text-base md:text-lg text-gray-900">
                          $
                          {(
                            (item.discountedPrice || item.price) * item.quantity
                          ).toFixed(2)}
                        </span>
                        <button
                          onClick={async () => {
                            await removeFromCart(item._id);
                          }}
                          disabled={loading}
                          className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 disabled:opacity-50"
                          title="Remove item"
                        >
                          <CgTrash size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Cart Summary */}
            <div className="border-t border-gray-200 px-6 py-5 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">Total Items:</span>
                <span className="font-bold text-gray-900">{itemsQuantity}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="px-6 py-5 bg-white space-y-3">
              <Link
                to={"/checkout"}
                className="btn w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                onClick={closeModal}
              >
                Proceed to Checkout
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  className="btn btn-outline border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold"
                  onClick={closeModal}
                  to={"/"}
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={loading}
                  className="btn btn-outline border-2 border-red-300 hover:bg-red-50 text-red-600 font-semibold disabled:opacity-50"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      {showClearConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Clear cart?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all items from your cart?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowClearConfirm(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn bg-red-500 hover:bg-red-600 text-white p-2"
                onClick={async () => {
                  await clearCart();
                  setShowClearConfirm(false);
                }}
              >
                Yes, Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click fuera para cerrar el modal */}
      <div className="modal-backdrop" onClick={closeModal}></div>
    </div>
  );
};

export default ModalCart;
