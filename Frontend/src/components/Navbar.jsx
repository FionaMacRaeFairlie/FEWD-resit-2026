import { Link, Outlet } from "react-router-dom";
import useToken from "./useToken";
import Logout from "./Logout";

import "../styles/styling.css";

const Navigation = () => {
  const { token, setToken } = useToken();
  return (
    <>
      {/* Navigation bar */}
      <nav className="w-full bg-white shadow-md rounded-b-xl px-6 py-4 flex gap-8 justify-center">
        <Link
          to="/"
          className="text-gray-800 font-medium hover:text-indigo-600 transition"
        >
          Calendar
        </Link>

        <Link
          to="/events"
          className="text-gray-800 font-medium hover:text-indigo-600 transition"
        >
          Events
        </Link>

        <Link
          to="/manageUser"
          className="text-gray-800 font-medium hover:text-indigo-600 transition"
        >
          Manage Users
        </Link>

        {token && <Logout setToken={setToken} />}
      </nav>

      {/* Page content */}
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
};

export default Navigation;
