import React, { useState }  from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";


const ProfileBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="text-white pt-6 px-4 py-2 w-1/6 lg:w-auto">
  <div className={`flex flex-col lg:flex-row lg:items-center p-6 rounded-3xl ${isOpen ? 'bg-gray-700' : 'bg-gray-700'}`}>
    <button
      className="lg:hidden mb-2 text-white focus:outline-none"
      onClick={() => setIsOpen(!isOpen)}
    >
      <FontAwesomeIcon icon={faBars} />
    </button>
    <ul className={`lg:flex lg:flex-col lg:items-center ${isOpen ? 'block' : 'hidden'} ${isOpen ? '' : 'text-sm'}`} style={{zIndex: "999"}}>
      <li className="py-2 text-xl hover:text-pink-700">
        <Link to={"/home"}>Home</Link>
      </li>
      <li className="py-2 text-xl hover:text-pink-700">
        <Link to={"/profile"}>Profile</Link>
      </li>
      <li className="py-2 text-xl hover:text-pink-700">
        <Link to={"/videolist"}>VideoList</Link>
      </li>
    </ul>
  </div>
</nav>

  );
};

export default ProfileBar;
