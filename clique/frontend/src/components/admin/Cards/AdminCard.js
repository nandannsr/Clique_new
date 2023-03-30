import React, { useState, useEffect } from "react";
import instance from "../../../utils/axiosInstance";

const AdminCard = () => {
  const [details, setDetails] = useState([]);
  const token = localStorage.getItem("access_token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDetails(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token]);
  console.log(details);

  return (
    <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-3xl shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h5 className="text-xl leading-none text-gray-900 dark:text-white mb-2 sm:mb-0">
          STATISTICS
        </h5>
        <div className="flex items-center justify-center sm:justify-end">
          
          
        </div>
      </div>
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          <li className="py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-xl text-gray-900 truncate dark:text-white">
                  User
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {details.user_count}
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-xl text-gray-900 truncate dark:text-white">
                  Total Videos
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {details.video_count}
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-xl text-gray-900 truncate dark:text-white">
                  Approval requests
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                4
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminCard;
