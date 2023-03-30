import React, { useState, useEffect } from "react";
import AdminNavbar from "./NavBar/AdminNavbar";
import AdminSideBar from "./NavBar/AdminSideBar";
import AdminCard from "./Cards/AdminCard";
import instance from "../../utils/axiosInstance";
import AdminChart from "./AdminChart";
import {useSelector} from 'react-redux';

const AdminHome = () => {
  let {user} = useSelector((state)=>state.user)
  let isAuth = useSelector((state)=>state.user.isAuth)
  console.log(isAuth)
  const [chartData, setChartData] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('api/chartData/');
        const data = response.data;
        setChartData(data)
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);
 
  return (
    <div className="flex flex-col min-h-screen bg-gray-800">
  <AdminNavbar />
  <div className="flex flex-1 bg-gray-800">
    <AdminSideBar />
    <main className="flex flex-col bg-gray-900 items-center justify-center p-5 md:p-10 lg:p-20 m-6 md:m-8 lg:m-12 rounded-3xl shadow-lg">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <AdminCard />
        <div className="flex-1 mt-5 md:mt-0">
          <div className="w-full max-w-md mx-auto border border-gray-200 rounded-lg shadow-md p-5">
            {Object.keys(chartData).length > 0 && <AdminChart chartData={chartData} />}
          </div>
        </div>
      </div>
    </main>
  </div>
</div>

  );
};

export default AdminHome;
