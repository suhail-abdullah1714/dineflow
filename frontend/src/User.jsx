import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menu = [
  {
    id: 1,
    name: "Truffle Chicken Burger",
    price: 220,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200",
    type: "nonveg",
    special: true,
    category: "food"
  },
  {
    id: 2,
    name: "Woodfire Pizza",
    price: 380,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200",
    type: "veg",
    special: true,
    category: "food"
  },
  {
    id: 3,
    name: "Creamy Alfredo Pasta",
    price: 320,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1200",
    type: "veg",
    special: false,
    category: "food"
  },
  {
    id: 4,
    name: "Crispy Fried Chicken",
    price: 280,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=1200",
    type: "nonveg",
    special: false,
    category: "food"
  },
  {
    id: 5,
    name: "Grilled Steak Deluxe",
    price: 650,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200",
    type: "nonveg",
    special: true,
    category: "food"
  },
  {
    id: 6,
    name: "Chocolate Lava Dessert",
    price: 260,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200",
    type: "veg",
    special: false,
    category: "food"
  },
  {
    id: 7,
    name: "Classic Mojito",
    price: 180,
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200",
    type: "veg",
    special: false,
    category: "drinks"
  },
  {
    id: 8,
    name: "Iced Caramel Latte",
    price: 200,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1200",
    type: "veg",
    special: false,
    category: "drinks"
  },
  {
    id: 9,
    name: "Berry Smoothie",
    price: 190,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=1200",
    type: "veg",
    special: false,
    category: "drinks"
  },
  {
    id: 10,
    name: "Fresh Lime Soda",
    price: 120,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1200",
    type: "veg",
    special: false,
    category: "drinks"
  },
  {
    id: 11,
    name: "Seafood Platter",
    price: 850,
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1200",
    type: "nonveg",
    special: true,
    category: "food"
  },
  {
    id: 12,
    name: "Sushi Deluxe",
    price: 720,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200",
    type: "nonveg",
    special: true,
    category: "food"
  }
];

function User() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [flyingItem, setFlyingItem] = useState(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const addToCart = (item, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyingItem({
      image: item.image,
      x: rect.left,
      y: rect.top
    });

    const existing = cart.find((i) => i.id === item.id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }

    setTimeout(() => setFlyingItem(null), 800);
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const filteredMenu = useMemo(() => {
    if (activeCategory === "all") return menu;
    if (activeCategory === "specials") return menu.filter((item) => item.special);
    return menu.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cart)
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setCart([]);
        setShowSuccessPopup(true);
        setMobileCartOpen(false);
      } else {
        alert("Failed to place order");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const CartContent = () => (
    <>
      <div className="mb-4 flex items-center justify-between">
        <motion.h2
          animate={cart.length > 0 ? { scale: [1, 1.05, 1] } : {}}
          className="text-xl font-black text-neutral-900 sm:text-2xl"
        >
          🛒 Your Cart
        </motion.h2>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
          {cartCount} item{cartCount !== 1 ? "s" : ""}
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-8 text-center">
          <p className="text-base font-semibold text-neutral-700">🍽️ Your table is waiting...</p>
          <p className="mt-2 text-sm text-neutral-500">
            Add items from the menu to start your DineFlow order.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-black/5 bg-neutral-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      ₹{item.price} × {item.qty}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-xl bg-gradient-to-r from-red-500 to-red-700 px-3 py-2 text-xs font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-lg font-bold text-neutral-800 transition hover:bg-neutral-300"
                  >
                    −
                  </button>

                  <span className="min-w-[28px] text-center text-base font-bold text-neutral-900">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-lg font-bold text-white transition hover:scale-105 hover:bg-black"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-neutral-950 p-5 text-white shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-base text-neutral-300">Grand Total</span>
              <span className="text-3xl font-black">₹{total}</span>
            </div>

            <button
              onClick={placeOrder}
              disabled={cart.length === 0 || loading}
              className={`w-full rounded-2xl py-3 text-base font-semibold text-white shadow-xl transition duration-300 ${
                cart.length === 0 || loading
                  ? "cursor-not-allowed bg-neutral-600 opacity-60"
                  : "bg-gradient-to-r from-neutral-700 via-neutral-900 to-black hover:scale-[1.02] hover:shadow-2xl"
              }`}
            >
              {loading ? "Placing Order..." : "🛒 Place Order"}
            </button>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <AnimatePresence>
        {flyingItem && (
          <motion.img
            key="flying-dot"
            src={flyingItem.image}
            initial={{
              x: flyingItem.x,
              y: flyingItem.y,
              opacity: 1,
              scale: 0.5,
              borderRadius: "50%"
            }}
            animate={{
              x: 80,
              y: 300,
              opacity: 0,
              scale: 0.1,
              rotate: 360
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="pointer-events-none fixed z-[9999] h-20 w-20 border-2 border-white object-cover shadow-2xl"
          />
        )}
      </AnimatePresence>

      <div className="w-full space-y-4 sm:space-y-5">
        <section className="w-full rounded-[24px] bg-gradient-to-r from-neutral-950 via-neutral-900 to-black px-5 py-6 text-white shadow-2xl sm:rounded-[28px] sm:px-8 sm:py-7">
          <div className="max-w-4xl">
            <p className="mb-2 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium sm:px-4 sm:text-xs">
              🍽️ DineFlow Premium Experience
            </p>
            <h1 className="text-2xl font-black leading-tight sm:text-3xl md:text-4xl">
              Welcome to DineFlow
            </h1>
            <p className="mt-2 text-sm text-neutral-300 sm:text-base">
              Order premium dishes with a smooth modern restaurant experience.
            </p>
          </div>
        </section>

        {/* Mobile category chips */}
        <section className="xl:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { key: "all", label: "All" },
              { key: "specials", label: "Specials" },
              { key: "food", label: "Food" },
              { key: "drinks", label: "Drinks" }
            ].map((chip) => (
              <button
                key={chip.key}
                onClick={() => setActiveCategory(chip.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === chip.key
                    ? "bg-neutral-900 text-white shadow-lg"
                    : "bg-white text-neutral-700 shadow"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          {/* Desktop cart only */}
          <aside className="hidden h-fit rounded-[26px] border border-black/5 bg-white p-5 shadow-xl xl:sticky xl:top-24 xl:block">
            <CartContent />
          </aside>

          <div className="rounded-[22px] border border-black/5 bg-white p-4 shadow-xl sm:rounded-[26px] sm:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-neutral-900 sm:text-3xl">Menu Highlights</h2>
              <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-2 text-[11px] font-semibold text-neutral-600 sm:px-4 sm:text-xs">
                {filteredMenu.length} Items
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {filteredMenu.map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  className="group overflow-hidden rounded-[22px] bg-neutral-50 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[24px]"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-36 w-full rounded-t-[22px] object-cover transition duration-500 group-hover:scale-105 sm:h-44 sm:rounded-t-[24px]"
                    />

                    {item.special && (
                      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 shadow-lg backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:py-1.5">
                        <span className="text-[11px] sm:text-[12px]">🔥</span>
                        <span className="text-[9px] font-bold uppercase tracking-wide text-orange-600 sm:text-[11px]">
                          Chef&apos;s Special
                        </span>
                      </div>
                    )}

                    <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
                      <div
                        className={`flex items-center gap-1 rounded-full px-2 py-1 shadow-md backdrop-blur sm:px-2.5 ${
                          item.type === "veg"
                            ? "bg-white/95 text-green-700"
                            : "bg-white/95 text-red-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-2.5 w-2.5 rounded-full ${
                            item.type === "veg" ? "bg-green-600" : "bg-red-600"
                          }`}
                        ></span>
                        <span className="text-[9px] font-bold uppercase tracking-wide sm:text-[10px]">
                          {item.type === "veg" ? "Veg" : "Non-Veg"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-black leading-tight text-neutral-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-500">
                          Freshly prepared premium dish
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-700 shadow-sm">
                        ₹{item.price}
                      </span>
                    </div>

                    <button
                      onClick={(e) => addToCart(item, e)}
                      className="w-full rounded-2xl bg-gradient-to-r from-black to-gray-800 px-5 py-3 text-base font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:shadow-2xl"
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Mobile sticky cart bar */}
      <AnimatePresence>
        {cartCount > 0 && !mobileCartOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-[999] xl:hidden"
          >
            <button
              onClick={() => setMobileCartOpen(true)}
              className="flex w-full items-center justify-between rounded-2xl bg-neutral-950 px-5 py-4 text-white shadow-2xl"
            >
              <div className="text-left">
                <p className="text-sm text-neutral-300">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
                <p className="text-lg font-black">₹{total}</p>
              </div>
              <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                View Cart
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile cart drawer */}
      <AnimatePresence>
        {mobileCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileCartOpen(false)}
              className="fixed inset-0 z-[1000] bg-black/50 xl:hidden"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-[1001] max-h-[85vh] rounded-t-[28px] bg-white p-5 shadow-2xl xl:hidden"
            >
              <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-neutral-300" />
              <div className="max-h-[70vh] overflow-y-auto pr-1">
                <CartContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="w-full max-w-md rounded-[24px] bg-white p-6 text-center shadow-2xl sm:rounded-[28px] sm:p-8"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl sm:h-20 sm:w-20 sm:text-4xl">
                ✅
              </div>

              <h2 className="text-2xl font-black text-neutral-900 sm:text-3xl">
                Order Confirmed
              </h2>
              <p className="mt-3 text-sm text-neutral-500 sm:text-base">
                Your DineFlow order has been placed successfully and sent to the restaurant.
              </p>

              <button
                onClick={() => setShowSuccessPopup(false)}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-neutral-900 to-black px-5 py-3 text-base font-semibold text-white shadow-xl transition duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default User;