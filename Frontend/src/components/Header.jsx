import Navigation from "./Navbar";
import "../styles/styling.css";

function getRoleFromToken() {
  const token = sessionStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function Header() {
  const role = getRoleFromToken();

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800 tracking-wide">
        Family Organiser
      </h1>

      <Navigation />

      {/* Spacer (keeps layout balanced if needed later) */}
      <div className="w-[100px]"></div>
    </header>
  );
}

export default Header;
