import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Otp from "./components/auth/Otp";
import Home from "./components/Home/Home";
import ForgotPassword from "./components/auth/ForgotPassword";
import NewPassword from "./components/auth/newPassword";
import PrivateRoute from "./routes/privateRoute";
import PublicRoute from "./routes/publicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/newPassword" element={<NewPassword />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
