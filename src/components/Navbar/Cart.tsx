import { FiShoppingCart } from "react-icons/fi";
import ModalCart from "./ModalCart";
import { useCart } from "../../context/useCart";

const Cart = () => {
  const { total, itemsQuantity, openModal, isModalOpen } = useCart();

  console.log("total carttt", total, "itemsQuantity carttt", itemsQuantity);

  const handleViewCart = () => {
    // Cerrar el dropdown quitando el focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    //Abrir el modal
    openModal();
  };

  return (
    <>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-success btn-circle"
          >
            <div className="indicator">
              <FiShoppingCart className="h-5 w-5" />
              <span className="badge badge-sm indicator-item">
                {itemsQuantity}
              </span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-[1000] mt-3 w-52 shadow"
          >
            <div className="card-body">
              <span className="text-lg font-bold">{itemsQuantity} item</span>
              <span className="text-info">Subtotal: {total}</span>
              <div className="card-actions">
                <button
                  className="btn bg-blue-600 hover:bg-blue-700 text-white btn-block"
                  onClick={handleViewCart}
                >
                  View cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <ModalCart />}
    </>
  );
};

export default Cart;
