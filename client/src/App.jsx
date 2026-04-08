import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import Register from "./pages/Register";
import ProtectRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/chat"
          element={
            <ChatProvider>
                 <ProtectRoute>
                       <ChatPage />
                </ProtectRoute>
            </ChatProvider>
            
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;