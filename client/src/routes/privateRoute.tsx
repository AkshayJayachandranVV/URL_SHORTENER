import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";


const PrivateRoute = () => {

    const token = Cookies.get('token');
    const refreshToken = Cookies.get('refreshToken');

    return token || refreshToken ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute