import { useEffect, useState } from "react";
import Admin from "./Admin";
import User from "./User";

const ADMIN_PASSWORD = "dineflow123";

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(
    window.location.hash === "#/admin"
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("dineflow_admin_auth") === "true"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === "#/admin");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("dineflow_admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
      setPassword("");
    } else {
      setError("Incorrect admin password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("dineflow_admin_auth");
    setIsAuthenticated(false);
    setPassword("");
    setError("");
    window.location.hash = "";
  };

  if (isAdminRoute) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-200 px-4 py-8">
          <div className="mx-auto max-w-md">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-2xl text-white shadow-lg">
                🍽️
              </div>
              <h1 className="text-3xl font-black text-neutral-900">DineFlow Admin</h1>
              <p className="mt-2 text-sm text-neutral-500">
                Enter the admin password to access the dashboard
              </p>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-2xl">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-neutral-900 to-black px-5 py-3 text-base font-semibold text-white shadow-xl transition duration-300 hover:scale-[1.02] hover:shadow-2xl"
                >
                  Login to Admin
                </button>
              </form>

              <button
                onClick={() => {
                  window.location.hash = "";
                }}
                className="mt-4 w-full rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-base font-semibold text-neutral-700 transition duration-300 hover:bg-neutral-50"
              >
                Back to Customer View
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-200">
        <div className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 xl:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-lg font-bold text-white shadow-md">
                🍽️
              </div>

              <div>
                <h1 className="text-lg font-black text-neutral-900">DineFlow Admin</h1>
                <p className="text-xs text-neutral-500">Protected dashboard access</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-black hover:shadow-xl"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="w-full px-4 py-5 md:px-6 xl:px-10">
          <Admin />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-200">
      <div className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 xl:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-lg font-bold text-white shadow-md">
              🍽️
            </div>

            <div>
              <h1 className="text-lg font-black text-neutral-900">DineFlow</h1>
              <p className="text-xs text-neutral-500">Smart restaurant ordering system</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-5 md:px-6 xl:px-10">
        <User />
      </div>
    </div>
  );
}

export default App;