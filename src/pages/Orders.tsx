import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getMyOrders } from "../services/orderService";
import { useUser } from "../context/useUser";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  status: "pending" | "approved" | "rejected" | "cancelled" | "in_process";
  totalAmount: number;
  createdAt: string;
  products: {
    productId: string;
    name?: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }[];
  shippingInfo: {
    firstName: string;
    lastName: string;
  };
}

const statusLabel: Record<Order["status"], string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  cancelled: "Cancelado",
  in_process: "En proceso",
};

const statusClass: Record<Order["status"], string> = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
  cancelled: "badge-ghost",
  in_process: "badge-info",
};

const Orders = () => {
  const { isAuthenticated, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !isAuthenticated()) {
      toast.error("Debes iniciar sesión para ver tus órdenes");
      navigate("/login", { state: { from: "/orders" } });
    }
  }, [userLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (userLoading || !isAuthenticated()) return;

    getMyOrders()
      .then((data) => setOrders(data.orders))
      .catch(() => toast.error("Error al cargar las órdenes"))
      .finally(() => setLoading(false));
  }, [userLoading]);

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mis Órdenes</h1>
          <Link to="/" className="btn btn-ghost btn-sm">
            Volver al inicio
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-base-100 rounded-lg shadow p-8 text-center">
            <p className="text-base-content/60 mb-4">No tenés órdenes todavía.</p>
            <Link to="/" className="btn btn-primary">
              Ir a comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-base-100 rounded-lg shadow p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-sm text-base-content/60 font-mono">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className={`badge ${statusClass[order.status]}`}>
                    {statusLabel[order.status]}
                  </span>
                </div>

                <div className="space-y-1 text-sm mb-3">
                  {order.products.map((p, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {p.name || `Producto`} × {p.quantity}
                      </span>
                      <span>${(p.price * p.quantity).toLocaleString("es-AR")}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                  <span className="text-xs text-base-content/50">
                    {new Date(order.createdAt).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-bold">
                    Total: ${order.totalAmount.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
