import Cookies from 'js-cookie'
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {

    const token = Cookies.get('accesToken');
    const refreshToken = Cookies.get('refreshToken');

    return token || refreshToken ? <Navigate to='/home' /> : <Outlet/>
}
export default PublicRoute;