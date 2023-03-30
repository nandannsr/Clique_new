import { useState, useRef, useEffect } from "react";
import { storage } from "../../utils/firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import instance from "../../utils/axiosInstance";
import fetchGenres from "../../utils/genresList.js";

const VideoUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [task, setTask] = useState(false);
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleGenreChange = (event) => {
    const selectedGenreId = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedGenres([...selectedGenres, selectedGenreId]);
    } else {
      setSelectedGenres(selectedGenres.filter((id) => id !== selectedGenreId));
    }
  };
  console.log(selectedGenres);
  useEffect(() => {
    const getGenres = async () => {
      const data = await fetchGenres();
      setGenres(data);
    };
    getGenres();
  }, []);

  const uploadTaskRef = useRef(null);
  const user = useSelector((state) => state.user.user.email);
  console.log(user);

  const handleUpload = async (video, thumbnail) => {
    if (!video || !thumbnail) return;

    const videoStorageRef = ref(storage, `videos/${video.name}`);
    const videoUploadTask = uploadBytesResumable(videoStorageRef, video);
    const thumbnailStorageRef = ref(storage, `thumbnails/${thumbnail.name}`);
    const thumbnailUploadTask = uploadBytesResumable(
      thumbnailStorageRef,
      thumbnail
    );
    const url = "/api/upload/";
    const token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    videoUploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(videoUploadTask.snapshot.ref).then(
          (videoDownloadURL) => {
            setVideoUrl(videoDownloadURL);
            thumbnailUploadTask.on(
              "state_changed",
              (snapshot) => {},
              (error) => {
                alert(error);
              },
              () => {
                getDownloadURL(thumbnailUploadTask.snapshot.ref).then(
                  (thumbnailDownloadURL) => {
                    setThumbnailUrl(thumbnailDownloadURL);
                    if (videoDownloadURL && thumbnailDownloadURL) {
                      const formData = new FormData();
                      formData.append("title", title);
                      formData.append("description", description);
                      const genreArray = [];
                      genreArray.push(...selectedGenres);

                      formData.append("genres", JSON.stringify(genreArray));
                      formData.append("file", videoDownloadURL);
                      formData.append("thumbnail", thumbnailDownloadURL);
                      try {
                        instance.post("/api/upload/", formData, headers);
                      } catch (error) {
                        console.error(error);
                      }
                      alert("Video uploaded successfully");
                      setTitle("");
                      setDescription("");
                      setVideo(null);
                      setThumbnail(null);
                      setSelectedGenres([]);
                    }
                  }
                );
              }
            );
          }
        );
      }
    );

    uploadTaskRef.current = {
      video: videoUploadTask,
      thumbnail: thumbnailUploadTask,
    };
    setTask(true);
  };

  const handleCancel = () => {
    if (uploadTaskRef.current) {
      uploadTaskRef.current.video.cancel();
      uploadTaskRef.current.thumbnail.cancel();
      uploadTaskRef.current = null;
      setProgresspercent(0);
      setVideoUrl(null);
      setTask(false);
      console.log("cancelled");
    }
  };

  const handlePauseResume = () => {
    if (!uploadTaskRef.current) return;

    const isPaused = task;
    if (!isPaused) {
      uploadTaskRef.current.video.resume();
      uploadTaskRef.current.thumbnail.resume();
      setTask(true);
      console.log("r");
    } else {
      uploadTaskRef.current.pause();
      console.log("p");
      setTask(false);
      console.log(isPaused);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !video) {
      alert("Please fill all fields");
      return;
    }
    if (video.size > 250 * 1024 * 1024) {
      alert("Maximum file size is 250 MB");
      return;
    }

    handleUpload(video, thumbnail);
  };

  return (
    <>
      {/* <h1 className="text-white text-4xl font-bold mb-8">Upload a Video</h1> */}
      <form className="bg-gray-800 p-8 rounded-3xl shadow-lg flex flex-col items-center">
        <div className="flex flex-col mb-4 w-full max-w-lg">
          <label className="text-white font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="bg-gray-700 text-white rounded-3xl py-2 px-3 w-full"
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the video title"
          />
        </div>
        <div className="flex flex-col mb-4 w-full max-w-lg">
          <label className="text-white font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="bg-gray-700 text-white rounded-3xl py-2 px-3 h-32 w-full resize-none"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the video description"
          ></textarea>
        </div>
        <div className="flex flex-col mb-4 w-full max-w-lg">
          <label className="text-white font-bold mb-2" htmlFor="video">
            Video
          </label>
          <input
            className="bg-gray-700 text-white rounded-3xl py-2 px-3 w-full"
            type="file"
            id="video"
            name="video"
            onChange={(e) => setVideo(e.target.files[0])}
            accept="video/*"
          />
        </div>
        <div className="flex flex-col mb-4 w-full max-w-lg">
          <label className="text-white font-bold mb-2" htmlFor="thumbnail">
            Thumbnail
          </label>
          <input
            className="bg-gray-700 text-white rounded-3xl py-2 px-3 w-full"
            type="file"
            id="thumbnail"
            name="thumbnail"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className="flex flex-col mb-4 w-full max-w-lg">
          <label className="text-white font-bold mb-2">Genres</label>
          {genres.map((genre) => (
            <div key={genre.id} className="flex items-center">
              <input
                type="checkbox"
                id={genre.genre_name}
                name="genres"
                value={genre.id}
                checked={selectedGenres.includes(genre.id)}
                onChange={handleGenreChange}
                className="mr-2"
              />
              <label className="text-white" htmlFor={genre.genre_name}>
                {genre.genre_name}
              </label>
            </div>
          ))}
        </div>
        <button
          className="bg-pink-600 text-white py-2 px-4 rounded-3xl shadow-lg hover:bg-pink-700 mt-4"
          onClick={handleSubmit}
        >
          Upload
        </button>
        {!videoUrl && (
          <div className="w-1/2 mt-4">
            <div className="bg-gray-200 rounded-full">
              <div
                className="bg-blue-500 rounded-full h-2"
                style={{ width: `${progresspercent}%` }}
              ></div>
            </div>
            <div className="text-right text-pink-700 text-xs mt-1">
              {progresspercent}%
            </div>
          </div>
        )}
        {uploadTaskRef.current && (
          <div className="mt-8">
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
              Cancel
            </button>
            <button
              onClick={handlePauseResume}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              {task ? "Pause" : "Resume"}
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default VideoUpload;
