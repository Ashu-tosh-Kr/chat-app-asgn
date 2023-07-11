import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { RequireAuth } from "./components/globals/ProtectedRoutes";
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/*" element={<RequireAuth />}>
        <Route path="chat" element={<Chat />} />

        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
