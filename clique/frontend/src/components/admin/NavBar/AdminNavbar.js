import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'


const AdminNavbar = () => {


  return (
    <header className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <h1 className="text-2xl font-bold">CliQue</h1>
      <div className="flex items-center">
        <span className="text-white px-4 py-2"><Link to={'/admin'}>DashBoard</Link></span>
       
      </div>
    </header>
  );
};

export default AdminNavbar;
