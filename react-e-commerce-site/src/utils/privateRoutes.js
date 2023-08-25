import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = ({condition,redirectTo}) => {
    if(redirectTo=="/"){
        return ( condition ? <Outlet/> : <Navigate to="/"/>)
    }else{
    return ( condition ? <Outlet/> : <Navigate to="/login"/>)

    }
}
export default PrivateRoutes