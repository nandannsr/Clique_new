import React, { useState, useEffect } from "react";
import AdminNavbar from "./NavBar/AdminNavbar";
import AdminSideBar from "./NavBar/AdminSideBar";
import fetchGenres from "../../utils/genresList";
import instance from "../../utils/axiosInstance";
import Swal from "sweetalert2";
import "../admin/css/sweetalert.css";

const AdminGenreList = () => {
  const [genres, setGenres] = useState([]);
  const [genreName, setGenreName] = useState("");
  const [showAddGenre, setShowAddGenre] = useState(false);
  const [gDelete, setGenreDelete] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    addGenre(genreName);
  }
  const genreDelete = async (id) => {
    try {
      const response = await instance.delete(
        `api/adminGenreDelete/${id}/delete`
      );
      console.log(response);
      if (response.status === 204) {
        setGenreDelete(false);
        Swal.fire("Genre deleted");
      }
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
        setGenreDelete(true);
        // User confirmed, do something
        genreDelete(id);
      }
    });
  }

  function addGenre(genreName) {
    instance
      .post("/api/adminAddGenre/", { genre_name: genreName })
      .then((response) => {
        console.log(response);
        console.log("Genre added successfully!");
        setGenreName("");
      })
      .catch((error) => {
        console.error("Error adding genre:", error);
      });
  }

  useEffect(() => {
    const getGenres = async () => {
      const data = await fetchGenres();
      setGenres(data);
    };
    getGenres();
  }, [genreName, gDelete]);

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <AdminNavbar />
      <div className="flex flex-1 bg-gray-800">
        <AdminSideBar />
        <main className="flex flex-col bg-gray-900 p-20  m-6 rounded-[50px] shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] ">
          <h1 className="text-white text-4xl mb-4">Genres</h1>
          <div className="flex flex-col">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className=" flex flex-row text-white text-3xl m-3"
              >
                {genre.genre_name}
                <button onClick={() => showAlert(genre.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#ff66cc"
                    width="24px"
                    height="24px"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M19 6h-3.5l-1-1h-5l-1 1H5v2h14V6zM7 11v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1v-9h-2v9H8v-9H7z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            className="bg-pink-700 text-sm text-white mx-2 mt-4 px-2 py-2 rounded-full"
            onClick={() => setShowAddGenre(true)}
          >
            Add
          </button>
        </main>
        {showAddGenre && (
          <div className="flex flex-col bg-gray-900 p-20 m-6 rounded-[50px] ">
            <form
              className="flex flex-col items-center justify-center"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="genreName"
                value={genreName}
                onChange={(event) => setGenreName(event.target.value)}
                className="text-sm border-none  m-2 px-2 py-2 rounded-full"
              />
              <div className="flex flex-row">
                <button
                  className="bg-pink-700 text-sm text-white mx-2 px-2 py-2 rounded-full"
                  type="submit"
                >
                  Save
                </button>
                <button
                  className="bg-pink-700 text-sm text-white mx-2 px-2 py-2 rounded-full"
                  onClick={() => setShowAddGenre(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGenreList;
