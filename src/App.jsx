import React from "react";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";

function App() {
  return (
    <div className="flex h-screen bg-zinc-900 text-gray-900">
      <Home />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;