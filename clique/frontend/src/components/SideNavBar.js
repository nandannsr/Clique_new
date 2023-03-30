import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import fetchGenres from "../utils/genresList";

const SideNavBar = () => {
  const navigate = useNavigate();
  

  const [genres, setGenres] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  
  useEffect(() => {
    const getGenres = async () => {
      const data = await fetchGenres();
      setGenres(data);
    };
    getGenres();
  }, []);
  return (
    <nav className="text-white pt-6 px-4 py-2 w-1/6">
    <div class="flex flex-wrap items-centermt-2 p-3 rounded-lg md:rounded-3xl bg-none lg:bg-gray-700">
      <div className="md:hidden">
        <button
          type="button"
          className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
            <path
              fillRule="evenodd"
              d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"
            />
          </svg>
        </button>
      </div>
      <ul className={`md:flex ${isOpen ? "flex" : "hidden"} flex-col md:items-center`}>
          <li className="py-1 md:py-2 md:text-xl hover:text-pink-700">
            <Link to={"/home"}>Home</Link>
          </li>
          {genres.map((genre) => (
            <li className="py-1 md:py-2 md:text-xl hover:text-pink-700">
              <Link to={`/search/${genre.genre_name}`}>{genre.genre_name}</Link>
            </li>
          ))}

          <button
            onClick={() => navigate("/upload")}
            className="bg-pink-700 text-lg hover:text-white mt-2 rounded-2xl p-2"
          >
            Upload
          </button>
        </ul>
      </div>
    </nav>
  );
};

export default SideNavBar;
