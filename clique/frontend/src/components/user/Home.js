import React, { useEffect, useState } from "react";
// import { useSelector } from 'react-redux';
import Header from "../Header";
import SideNavBar from "../SideNavBar";
import instance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get("/api/videos");
        setVideos(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  console.log(videos);
  // const user = useSelector(state => state.user);
  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <Header />

      <div className="flex flex-col lg:flex-row bg-gray-800">
        <SideNavBar />
        <main className="flex flex-col bg-gray-900 items-center justify-center p-20 m-6 rounded-[50px] shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] ">
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg"
              >
                {" "}
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className=" w-96 h-58 object-cover"
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/300x200"
                    alt={video.title}
                    className="w-96 h-58 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-sm font-sm text-gray-800 mb-2">
                    {video.title}
                  </h3>
                  <Link
                    to={`/playing/${encodeURIComponent(encodeURI(video.file))}`}
                  >
                    <p className="text-gray-600">{video.description}</p>{" "}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
