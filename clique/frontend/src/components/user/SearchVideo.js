import React, { useEffect, useState } from "react";
// import { useSelector } from 'react-redux';
import Header from "../Header";
import SideNavBar from "../SideNavBar";
import instance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const SearchVideo = () => {
  const { searchQuery } = useParams();
  console.log(searchQuery);
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(`api/search?search=${searchQuery}`);
        setVideos(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [searchQuery]);
  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <Header />

      <div className="flex flex-1 bg-gray-800 ">
        <SideNavBar />
        <main className="flex flex-col bg-gray-900 items-center justify-center p-20 m-6 rounded-[50px] shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] ">
          {videos.length === 0 && (
            <h1 className="text-pink-700 text-5xl">No Videos found</h1>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-96 h-58 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-sm font-sm text-gray-800 mb-2">
                    {video.title}
                  </h3>
                  <Link to={`/playing/${encodeURIComponent(video.file)}`}>
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

export default SearchVideo;
