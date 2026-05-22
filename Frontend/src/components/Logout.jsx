import { useNavigate } from "react-router-dom";

function Logout({ setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from storage
    sessionStorage.removeItem("token");

    // Clear token state
    setToken(null);

    // Redirect to login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-400"
    >
      Logout
    </button>
  );
}

export default Logout;
