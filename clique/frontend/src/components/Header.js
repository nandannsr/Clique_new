import React from "react";
import { useState, useEffect } from "react";
// import { useSelector } from 'react-redux'
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/search/${searchQuery}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <header className="bg-gray-800 text-white px-4 py-2 flex flex-wrap justify-between items-center">
      <h1 className="text-2xl font-bold">CliQue</h1>
      <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-auto">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center justify-center rounded-full bg-gray-800 px-2 py-1 mx-4 mt-4 md:mt-0 md:ml-4 w-full md:w-auto"
        >
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-white text-black rounded-full outline-none w-full py-2 px-4"
          />
          <button
            type="submit"
            className="bg-gray-500 text-white px-4 py-2 rounded-full ml-2"
          >
            Search
          </button>
        </form>
        <div className="flex items-center mt-4 md:mt-0">
          <span className=" text-white px-4 py-2">
            <Link to={"/home"}>Home</Link>
          </span>
          <button className="bg-pink-700 text-white px-4 py-2 rounded-full ml-4">
            <Link to={"/profile"}>Profile</Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
