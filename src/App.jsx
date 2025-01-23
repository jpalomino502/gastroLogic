import React from "react";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="flex h-screen bg-zinc-900 text-gray-900">
      <Dashboard />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;