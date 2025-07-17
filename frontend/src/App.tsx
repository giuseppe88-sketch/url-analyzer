import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Details from "./pages/details";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/details/:id" element={<Details />} />
    </Routes>
  );
}

export default App;
