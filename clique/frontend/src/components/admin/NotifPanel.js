import React, { useEffect, useState } from "react";
import AdminNavbar from "./NavBar/AdminNavbar";
import AdminSideBar from "./NavBar/AdminSideBar";
import instance from "../../utils/axiosInstance";
import { getWebsocket } from "../../utils/adminSocket/webSocket";
import fetchVideo from "../../utils/videoRetrieve";
import Swal from "sweetalert2";

const NotifPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [videoDetails, setVideoDetails] = useState([]);
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = async (id) => {
    try {
      setIsDelete(true);
      const response = await instance.delete(`api/notifDelete/${id}/delete`);
      console.log(response.data);
      if (response.status === 204) {
        setIsDelete(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const websocket = getWebsocket();
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage(data.message);
    };

    websocket.onerror = (event) => {
      console.error("WebSocket error:", event);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get("/api/notifications");
        const sortedNotifications = response.data.sort((a, b) => b.id - a.id); // Sort notifications by ID
        setNotifications(sortedNotifications);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [message, isDelete]);
  console.log(notifications);

  const handleClick = (id) => {
    setShowNotification(true);
    fetchVideo(id)
      .then((data) => {
        setVideoDetails(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(videoDetails);

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <AdminNavbar />
      <div className="flex flex-1 bg-gray-800">
        <AdminSideBar />
        <main className="flex flex-col bg-gray-900 p-20  m-6 rounded-[50px] shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] ">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notify) => (
                <div key={notify.id} className=" py-4 lg:px-4">
                  <div
                    className="p-2 bg-gray-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
                    role="alert"
                  >
                    <span className="flex rounded-full text-pink-600 bg-gray-900 uppercase px-2 py-1 text-xs font-bold mr-3">
                      {notify.id}
                    </span>
                    <span className="font-semibold mr-2 text-left flex-auto">
                      {notify.message}
                    </span>
                    <button onClick={() => handleClick(notify.video)}>
                      <svg
                        className="animate-bounce fill-current text-pink-800 opacity-75 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(notify.id)}>
                      <svg
                        className="fill-current text-pink-700 h-4 w-4 ml-2 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm2-10.586L12.586 8 10 10.586 7.414 8 6 9.414 8.586 12 6 14.586 7.414 16 10 13.414 12.586 16 14 14.586 11.414 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-2xl text-pink-700">
              No new notifications!
            </div>
          )}
        </main>
        {showNotification && (
          <div className="flex flex-col bg-gray-900 p-20 m-6 rounded-[50px] shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] ">
            <div className="flex flex-col items-center p-4">
              <div className="p-4">
                <img
                  src={videoDetails.thumbnail}
                  alt={videoDetails.title}
                  className=" w-40 h-34 object-cover"
                />
              </div>
              <h1 className="text-white text-2xl p-2">{videoDetails.title}</h1>
              <h2 className="text-white text-2xl p-2">
                {videoDetails.description}
              </h2>
            </div>
            <button
              className="bg-pink-700 text-sm text-white mx-2 px-2 py-2 rounded-full"
              onClick={() => setShowNotification(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotifPanel;
