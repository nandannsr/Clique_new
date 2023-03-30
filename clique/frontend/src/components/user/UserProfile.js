import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit } from "@fortawesome/free-solid-svg-icons";
import Header from '../Header';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import instance from '../../utils/axiosInstance';
import ProfileBar from './ProfileBar';

const UserProfile = () => {

  const userData = useSelector((state) => state.user.user)
  const navigate = useNavigate()
  const [videos, setVideos] = useState()
  console.log(videos)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('api/userVideoCount/')
        console.log(response)
        setVideos(response.data.video_count)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])


  return (
    <div className="flex flex-col h-screen bg-gray-800">
  <Header />
  <div className='flex flex-col lg:flex-row bg-gray-800'>
    <ProfileBar />
    <div className="flex flex-col bg-gray-900 p-8 md:p-12 lg:p-20 m-2 md:m-4 lg:m-6 rounded-3xl shadow-lg">
  <div className="flex items-center mb-8">
    <div className="w-16 h-16 rounded-full overflow-hidden">
      <FontAwesomeIcon icon={faUser} className="text-gray-400 w-full h-full" />
    </div>
    <div className="ml-4">
      <h1 className="text-white text-3xl">{userData.username}</h1>
      <p className="text-gray-400">{userData.email}</p>
      <button onClick={() => navigate('/editProfile')}>
        <FontAwesomeIcon icon={faEdit} className="text-pink-700" />
      </button>
    </div>
  </div>
  <div className="flex-1 flex-col text-center">
    <div className="flex flex-col md:flex-row w-full md:space-x-4">
      <div className="bg-gray-700 rounded-lg p-4 md:flex-1">
        <h2 className="text-white text-lg mb-4 inline-block">Personal Information</h2>
        <p className="text-gray-400">
          {userData.firstname}<br />
          {userData.lastname}<br />
          {userData.phonenumber}<br />
        </p>
      </div>
      <div className="bg-gray-700 rounded-lg p-4 md:flex-1 mt-4 md:mt-0">
        <h2 className="text-white text-lg mb-4 inline-block">Content List</h2>
        <p className="text-gray-400">
          Video Count<br /> <button onClick={() => navigate('/videolist')} className='text-pink-700'>{videos}</button>
        </p>
      </div>
    </div>
  </div>
</div>

  </div>
</div>

  )
}

export default UserProfile