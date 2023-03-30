import React from "react";
import AdminNavbar from "./NavBar/AdminNavbar";
import AdminSideBar from "./NavBar/AdminSideBar";
import VideoJS from "../videoPlayer/VideoJS";
import videojs from "video.js";
import { useParams } from "react-router-dom";

const AdminVideoPlay = () => {
  const playerRef = React.useRef(null);
  let { videoUrl } = useParams();
  console.log(videoUrl);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: false,
    width: 720,
    height: 360,
    sources: [
      {
        src: videoUrl,
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <AdminNavbar />
      <div className="flex flex-1 bg-gray-800">
        <AdminSideBar />
        <main className="flex flex-col bg-gray-900  p-20  m-6 rounded-[50px] shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] ">
          <h1 className="text-2xl text-white font-bold mb-6">Video View</h1>
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </main>
      </div>
    </div>
  );
};

export default AdminVideoPlay;
