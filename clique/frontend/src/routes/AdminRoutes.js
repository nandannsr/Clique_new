import { Outlet,Navigate } from "react-router-dom";
import React from 'react'
import {useSelector} from 'react-redux';

const AdminRoutes = () => {
  let {user} = useSelector((state)=>state.user)
  
  return (
    user.isAdmin ?<Outlet/> :  <Navigate to="/admin"/>
  )
}

export default AdminRoutes