import { Outlet,Navigate } from "react-router-dom";
import React from 'react'
import {useSelector} from 'react-redux';

const PrivateRoutes = () => {
    let {user} = useSelector((state)=>state.user)
    return (
        (user&&user.isLoggedIn) ?<Outlet/> :  <Navigate to="/login"/>
    )
}

export default PrivateRoutes 