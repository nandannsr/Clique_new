import React, { useEffect, useState } from "react";
import AdminNavbar from "./NavBar/AdminNavbar";
import AdminSideBar from "./NavBar/AdminSideBar";
import instance from "../../utils/axiosInstance";
import Swal from "sweetalert2";
import "../admin/css/sweetalert.css";

const AdminUserList = () => {
  const [userList, setUserList] = useState([]);
  const [isBlocked, setIsBlockCalled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const userBlock = async (id) => {
    try {
      console.log(id);
      const response = await instance.post("api/adminUserBlock/", { id });
      console.log(response);
      if (response.status === 200) {
        setIsBlockCalled(false);
        Swal.fire("User Blocked");
      }
    } catch (error) {
      console.log(error);
    }
  };
  function showAlert(id) {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b0266b",
      cancelButtonColor: "#b0266b",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsBlockCalled(true);
        // User confirmed, do something
        userBlock(id);
      }
    });
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get("/api/adminUserList");
        console.log(response);
        setUserList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [isBlocked]);
  console.log(userList);
  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <AdminNavbar />
      <div className="flex flex-1 bg-gray-800">
        <AdminSideBar />
        <main className="flex flex-col bg-gray-900 p-6 md:p-20 rounded-[50px] shadow-[0_35px_60px_-15px_rgba(0,0,0,1)]">
          <div className="relative md:ml-auto w-full md:w-60 mb-6">
            <input
              className="block w-full bg-white border border-transparent rounded-2xl py-2 pl-10 pr-3 text-black placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 focus:placeholder-gray-400 sm:text-sm"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search"
            />
          </div>
          <h1 className="text-2xl text-white font-bold mb-6">User List</h1>
          <div class="overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="text-gray-300 uppercase text-sm leading-normal">
                  <th class="text-xl py-3 px-6 text-left">First Name</th>
                  <th class="text-xl py-3 px-6 text-left">Last Name</th>
                  <th class="text-xl py-3 px-6 text-left">Email</th>
                  <th class="text-xl py-3 px-6 text-left">Phone Number</th>
                  <th class="text-xl py-3 px-6 text-left">Total Videos</th>
                  <th class="text-xl py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody class="text-white text-sm font-light">
                {userList
                  .filter(
                    (user) =>
                      user.first_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.last_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((user) => (
                    <tr key={user.id} class="border-b border-gray-200">
                      <td class="py-3 px-6 text-left whitespace-nowrap">
                        {user.first_name}
                      </td>
                      <td class="py-3 px-6 text-left whitespace-nowrap">
                        {user.last_name}
                      </td>
                      <td class="py-3 px-6 text-left">{user.email}</td>
                      <td class="py-3 px-6 text-left">{user.phone_number}</td>
                      <td class="py-3 px-6 text-left">{user.video_count}</td>
                      <td class="py-3 px-6 text-left">
                        <button
                          onClick={() => showAlert(user.id)}
                          class="bg-pink-700 text-white px-4 py-2 rounded-full"
                        >
                          {user.is_active ? "Block" : "Unblock"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUserList;
