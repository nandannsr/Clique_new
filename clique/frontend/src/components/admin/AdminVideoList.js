import React, { useEffect, useState } from "react";
import AdminNavbar from "./NavBar/AdminNavbar";
import AdminSideBar from "./NavBar/AdminSideBar";
import instance from "../../utils/axiosInstance";
import Swal from "sweetalert2";
import "../admin/css/sweetalert.css";
import { Link } from "react-router-dom";

const AdminVideoList = () => {
  const [videoList, setVideoList] = useState([]);
  const [isApproveCalled, setIsApproveCalled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const videoApprove = async (id) => {
    try {
      const response = await instance.post("/api/adminVideoApprove", { id });
      setIsApproveCalled(true);
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
        // User confirmed, do something
        videoApprove(id);
      }
    });
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get("/api/adminVideoList");
        console.log(response);
        setVideoList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    if (isApproveCalled) {
      setIsApproveCalled(false);
    }
  }, [isApproveCalled]);
  console.log(videoList);

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <AdminNavbar />
      <div className="flex flex-1 bg-gray-800">
        <AdminSideBar />
        <main class="flex flex-col bg-gray-900 px-4 py-8 md:p-20 m-6 rounded-3xl shadow-md">
          <div class="relative mb-4 md:ml-auto md:w-64">
            <input
              class="block w-full bg-white border border-transparent rounded-full py-2 pl-10 pr-3 text-black placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 focus:placeholder-gray-400 text-sm"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search"
            />
          </div>
          <h1 class="text-2xl text-white font-bold mb-6">Video List</h1>
          <div class="overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="text-gray-300 uppercase text-sm leading-normal">
                  <th class="text-xl py-3 px-4 md:px-6 text-left">Video</th>
                  <th class="text-xl py-3 px-4 md:px-6 text-left">Title</th>
                  <th class="text-xl py-3 px-4 md:px-6 text-left">
                    Description
                  </th>
                  <th class="text-xl py-3 px-4 md:px-6 text-left">User</th>
                  <th class="text-xl py-3 px-4 md:px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody class="text-white text-sm font-light">
                {videoList
                  .filter(
                    (video) =>
                      video.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      video.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      video.user.first_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((video) => (
                    <tr key={video.id} class="border-b border-gray-200">
                      <td class="py-3 px-4 md:px-6 text-left whitespace-nowrap">
                        <Link
                          to={`/adminVideoPlay/${encodeURIComponent(
                            encodeURI(video.file)
                          )}`}
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            class="w-40 h-34 object-cover"
                          />
                        </Link>
                      </td>
                      <td class="py-3 px-4 md:px-6 text-left whitespace-nowrap">
                        {video.title}
                      </td>
                      <td class="py-3 px-4 md:px-6 text-left">
                        {video.description}
                      </td>
                      <td class="py-3 px-4 md:px-6 text-left">
                        {video.user.first_name}
                      </td>
                      <td class="py-3 px-4 md:px-6 text-left">
                        <button
                          onClick={() => showAlert(video.id)}
                          class="bg-pink-700 text-white px-4 py-2 rounded-full"
                        >
                          {video.is_approved ? "Revoke" : "Approve"}
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

export default AdminVideoList;
