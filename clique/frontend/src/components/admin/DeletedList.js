import React, { useEffect, useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../utils/firebase";
import AdminNavbar from "./NavBar/AdminNavbar";
import AdminSideBar from "./NavBar/AdminSideBar";
import instance from "../../utils/axiosInstance";
import Swal from "sweetalert2";
import "../admin/css/sweetalert.css";
import { Link } from "react-router-dom";

const DeletedList = () => {
  const [videoList, setVideoList] = useState([]);
  const videoDelete = async (url, id) => {
    try {
      // Create a reference to the file to delete
      const videoRef = ref(storage, url);

      // Delete the file
      await deleteObject(videoRef);

      // Log success message
      console.log(`File ${url} deleted successfully`);
      const response = await instance.delete(
        `api/adminDeleteVideo/${id}/delete`
      );
      if (response.status === 204) {
        Swal.fire("Video deleted successfully");
      } else {
        console.log("Failed to delete video object");
      }
    } catch (error) {
      console.log(error);
    }
  };
  function showAlert(url, id) {
    Swal.fire({
      title: "Are you sure? The video will be deleted permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b0266b",
      cancelButtonColor: "#b0266b",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, do something
        videoDelete(url, id);
      }
    });
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get("/api/adminDeleteList");
        console.log(response);
        setVideoList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  console.log(videoList);
  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <AdminNavbar />
      <div className="flex flex-1 bg-gray-800">
        <AdminSideBar />
        <main className="flex flex-col bg-gray-900  p-20  m-6 rounded-[50px] shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] ">
          <h1 className="text-2xl text-white font-bold mb-6">Video List</h1>
          <table className="w-full table-auto">
            <thead>
              <tr className="text-gray-300 uppercase text-sm leading-normal">
                <th className="text-xl py-3 px-6 text-left">Video</th>
                <th className="text-xl py-3 px-6 text-left">Title</th>
                <th className="text-xl py-3 px-6 text-left">Description</th>

                <th className="text-xl py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm font-light">
              {videoList.map((video) => (
                <tr key={video.id} className="border-b border-gray-200">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <Link
                      to={`/adminVideoPlay/${encodeURIComponent(
                        encodeURI(video.file)
                      )}`}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className=" w-40 h-34 object-cover"
                      />
                    </Link>
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {video.title}
                  </td>
                  <td className="py-3 px-6 text-left">{video.description}</td>

                  <td className="py-3 px-6 text-left">
                    <button
                      onClick={() => showAlert(video.file, video.id)}
                      className="bg-pink-700 text-white px-4 py-2 rounded-full"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default DeletedList;
