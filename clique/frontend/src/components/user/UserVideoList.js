import React, { useState, useEffect } from "react";
import Header from "../Header";
import instance from "../../utils/axiosInstance";
import Swal from "sweetalert2";
import "../admin/css/sweetalert.css";
import { Link } from "react-router-dom";
import ProfileBar from "./ProfileBar";

const UserVideoList = () => {
  const [videos, setVideos] = useState([]);
  const [isDeleteCalled, setIsDeleteCalled] = useState(false);
  const videoDelete = async (id) => {
    try {
      const response = await instance.post("api/userDeleteVideo/", { id });
      setIsDeleteCalled(true);
      console.log(response);
      Swal.fire(response.data.message);
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
        videoDelete(id);
      }
    });
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get("api/userVideoList/");
        setVideos(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    if (isDeleteCalled) {
      setIsDeleteCalled(false);
    }
  }, [isDeleteCalled]);
  console.log(videos);
  return (
    <div>
      <div className="flex flex-col h-screen bg-gray-800">
        <Header />

        <div className="flex flex-col lg:flex-row bg-gray-800">
          <ProfileBar />
          <main className="flex flex-col bg-gray-900 p-6 sm:p-10 md:p-16 lg:p-20 rounded-[50px] shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] ">
            <h1 className="text-2xl text-white font-bold mb-6">Video List</h1>
            {videos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table-auto border-collapse text-white text-sm font-light">
                  <thead>
                    <tr className="text-gray-300 uppercase text-sm leading-normal">
                      <th className="px-4 sm:px-6 py-3 sm:py-4 md:py-5 text-left">
                        Video
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 md:py-5 text-left">
                        Title
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 md:py-5 text-left">
                        Description
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 md:py-5 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video) => (
                      <tr key={video.id} className="border-b border-gray-200">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap">
                          <Link
                            to={`/profile/${encodeURIComponent(
                              encodeURI(video.file)
                            )}`}
                          >
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-24 sm:w-32 h-auto object-cover"
                            />
                          </Link>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap text-xl">
                          {video.title}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap text-xl">
                          {video.description}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap">
                          <button
                            onClick={() => showAlert(video.id)}
                            className="bg-pink-700 text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded-full"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <h1 className="text-2xl text-pink-700 mb-6">
                No Videos Uploaded By The User
              </h1>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserVideoList;
