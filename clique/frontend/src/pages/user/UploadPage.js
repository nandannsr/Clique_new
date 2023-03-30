import VideoUpload from "../../components/user/VideoUpload";
import Header from "../../components/Header";
import SideNavBar from "../../components/SideNavBar";

import React from 'react'

const UploadPage = () => {
  return (
    <div>
  <Header />
  <div className="flex flex-col lg:flex-row bg-gray-800">

      <SideNavBar />
      <div className="mx-auto">
               <VideoUpload />
     </div>
    
    </div>
   </div>
  )
}

export default UploadPage