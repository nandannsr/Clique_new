import React, { useState, useEffect } from "react";
import { getWebsocket } from "../../../utils/adminSocket/webSocket";
import { Link } from "react-router-dom";

const AdminSideBar = () => {
  const [message, setMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);

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

  return (
    <nav className="text-white pt-6 px-4 py-2 w-full md:w-1/6">
      <div className="flex lg:bg-gray-700 md:block rounded-3xl">
        <button
          className="md:hidden block ml-auto mr-4 mt-2"
          onClick={() => setShowMenu(!showMenu)}
        >
          <svg
            className="fill-current h-6 w-6"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path
              fillRule="evenodd"
              d="M2 4h16a1 1 0 110 2H2a1 1 0 110-2zm0 6h16a1 1 0 110 2H2a1 1 0 110-2zm0 6h16a1 1 0 110 2H2a1 1 0 110-2z"
            />
          </svg>
        </button>
        <ul
          className={`${
            showMenu ? "block" : "hidden"
          } md:block md:bg-gray-700 md:p-6 md:rounded-3xl`}
        >
          <li className="py-2 text-xl hover:text-pink-700">
            <Link to={"/admin"}>DashBoard</Link>
          </li>
          <li className="py-2 text-xl hover:text-pink-700">
            <Link to={"/adminUserList"}>User List</Link>
          </li>
          <li className="py-2 text-xl hover:text-pink-700">
            <Link to={"/adminVideoList"}>Video List</Link>
          </li>
          <li className="py-2 text-xl hover:text-pink-700">
            <Link to={"/adminGenreList"}>Genres</Link>
          </li>
          <li className="py-2 text-xl hover:text-pink-700">
            <div className="flex items-center">
              <Link to={"/adminNotify"}>Notifications</Link>
              {message && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="text-green-500 animate-spin m-2 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                  />
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                    />
                  </svg>
                )}
              </div>
            </li>
            <li className="py-2 text-xl hover:text-pink-700">
              <Link to={"/deletedList"}>Deleted Video</Link>
            </li>
          </ul>
        </div>
    </nav>
  );
};

export default AdminSideBar;
