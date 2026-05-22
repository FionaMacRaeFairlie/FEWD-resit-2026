import { useState } from "react";
import "../styles/styling.css";
import { useNavigate } from "react-router-dom";

async function loginUser(credentials) {
  return fetch("http://localhost:3002/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [familyId, setFamilyId] = useState();

  const navigate = useNavigate();

  const goToRegister = () => {
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
      familyId,
    });
    setToken(token);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Please log in</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Family ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Family ID
            </label>
            <input
              type="text"
              placeholder="Enter your Family ID"
              onChange={(e) => setFamilyId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Buttons */}
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Log In
          </button>

          <button
            type="button"
            onClick={goToRegister}
            className="w-full py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
