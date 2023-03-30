import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/wel.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div>
      <header className="bg-gray-800 text-white px-4 py-2 flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold">CliQue</h1>
        <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-auto">
          <div className="flex items-center mt-4 md:mt-0">
            <span className=" text-white">Already a User ,</span>
            <button className="bg-pink-700 text-white px-4 py-2 rounded-full ml-4">
              <Link to={"/login"}>Login</Link>
            </button>
          </div>
        </div>
      </header>
      <div className="outer-container">
        <div className="inner-continer">
          <h3 className="text-4xl">Welcome To Clique</h3>
          <h1>
            <span className="pink-text text-3xl">FOLLOW</span> YOUR FAVOURITE
            <br /> GAMERZ HERE
          </h1>
          <button className="custom-btn mt-4"><Link to={"/register"}>Signup Now</Link></button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
