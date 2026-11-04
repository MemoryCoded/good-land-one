import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

export function AdminLoginPage() {
  const [key, setKey] = useState("");
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      login(key.trim());
      navigate("/admin/library"); // Redirect to admin dashboard
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-lg w-96 border border-zinc-200"
      >
        <h1 className="text-2xl font-bold mb-6 font-orbitron text-center text-zinc-800">
          Admin Access
        </h1>
        <input
          type="password"
          placeholder="Enter API Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full border border-zinc-300 p-3 rounded mb-4 font-mono text-sm focus:outline-none focus:border-black"
        />
        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded font-bold hover:bg-zinc-800 transition-colors font-orbitron"
        >
          Login
        </button>
      </form>
    </div>
  );
}
