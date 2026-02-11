import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import AddIP from "./pages/AddIP";

export default function App() {
  return (
    <>
      <nav style={{ padding: 12, display: "flex", gap: 12 }}>
        <Link to="/">Login</Link>
        <Link to="/add-ip">Add IP</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/add-ip" element={<AddIP />} />
      </Routes>
    </>
  );
}
