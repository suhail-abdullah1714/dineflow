import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const BASE_URL = "https://smart-restaurant-backend-za29.onrender.com";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [clearing, setClearing] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const clearAllOrders = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all orders?"
    );

    if (!confirmClear) return;

    try {
      setClearing(true);

      const res = await fetch(`${BASE_URL}/orders`, {
        method: "DELETE"
      });

      const text = await res.text();
      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || "Unknown server response" };
      }

      console.log("Delete response:", data);

      if (res.ok) {
        setOrders([]);
        alert(`Cleared ${data.deletedCount || 0} orders successfully`);
      } else {
        alert(data.error || "Failed to clear orders");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong while clearing orders");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-gradient-to-r from-neutral-950 via-neutral-900 to-black px-8 py-8 text-white shadow-2xl">
        <p className="mb-2 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium">
          Restaurant Control Center
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black md:text-5xl">📊 DineFlow Admin Dashboard</h1>
            <p className="mt-3 text-neutral-300">
              Monitor customer orders and manage restaurant activity in real time.
            </p>
          </div>

          <button
            onClick={clearAllOrders}
            disabled={orders.length === 0 || clearing}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-xl transition duration-300 ${
              orders.length === 0 || clearing
                ? "cursor-not-allowed bg-neutral-600 opacity-60"
                : "bg-gradient-to-r from-red-600 to-red-800 hover:scale-105 hover:shadow-2xl"
            }`}
          >
            {clearing ? "Clearing..." : "🧹 Clear All Orders"}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-xl">
          <p className="text-sm text-neutral-500">Total Orders</p>
          <h2 className="mt-2 text-3xl font-black text-neutral-900">
            {orders.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl">
          <p className="text-sm text-neutral-500">Latest Activity</p>
          <h2 className="mt-2 text-xl font-black text-neutral-900">
            {orders.length > 0 ? dayjs(orders[0].createdAt).fromNow() : "No activity"}
          </h2>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-10 text-center shadow-lg">
          <p className="text-xl font-semibold text-neutral-700">No orders yet</p>
          <p className="mt-2 text-sm text-neutral-500">
            New customer orders will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-[26px] bg-white p-6 shadow-xl"
            >
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-black text-neutral-900">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    🕒 {dayjs(order.createdAt).fromNow()}
                  </p>
                </div>

                <span className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
                  Total: ₹{order.total}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-black/5">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-black/5 bg-neutral-50 px-4 py-3 last:border-b-0"
                  >
                    <div>
                      <p className="font-bold text-neutral-900">{item.name}</p>
                      <p className="text-sm text-neutral-500">Quantity: {item.qty}</p>
                    </div>
                    <p className="font-semibold text-neutral-800">
                      ₹{item.price * item.qty}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;