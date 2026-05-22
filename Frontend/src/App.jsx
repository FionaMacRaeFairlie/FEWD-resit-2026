import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Events";
import Register from "./components/Register";
import CalendarPage from "./components/CalendarPage";
import Login from "./components/login";
import useToken from "./components/useToken";
import ManageUser from "./components/ManageUsers";

function App() {
  const { setToken } = useToken();
  return (
    <Routes>
      <Route path="/" element={<CalendarPage />}></Route>
      <Route path="/events" element={<Home />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/login" element={<Login setToken={setToken} />}></Route>
      <Route path="/manageUser" element={<ManageUser />}></Route>
    </Routes>
  );
}
export default App;
