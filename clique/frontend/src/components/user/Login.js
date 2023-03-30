import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, GLogin } from "../../redux/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import instance from "../../utils/axiosInstance";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user.user);
  console.log(user);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState(location.state?.message);
  // useEffect(() => {
  //   if (user.isLoggedIn) {
  //     user.isAdmin ? navigate("/admin") : navigate("/home");
  //   }
  // }, []);

  const gLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
      axios
        .post("http://127.0.0.1:8000/api/google/", { id: codeResponse.code })
        .then((response) => {
          console.log(response);
          dispatch(GLogin(response.data));
          navigate("/home");
        })
        .catch((error) => {
          console.error(error);
        });
    },
    flow: "auth-code",
  });

  // Use setTimeout to remove the message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message]);

  const handleLogin = async () => {
    console.log(email, password);
    const { access, isAdmin } = await dispatch(loginUser(email, password));
    if (access) {
      isAdmin ? navigate("/admin") : navigate("/home");
    }
  };
  return (
    <div className="bg-slate-800 min-h-screen">
      {message && (
        <div
          className="fixed bottom-0 left-0 right-0 mx-auto w-3/4 max-w-xl p-10 text-center"
          style={{ marginBottom: "10vh" }}
        >
          <p className="text-pink-600">{message}</p>
        </div>
      )}
      <header className="flex items-center justify-between p-4">
        <div className="text-pink-600 font-medium text-2xl">CliQue</div>
        <div className="flex items-center">
          <button
            className="bg-pink-600 text-white py-1 px-2 rounded-full"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </header>
      <div
        className="mx-auto w-3/4 max-w-xl p-20 bg-slate-900"
        style={{ marginTop: "10vh", borderRadius: "90px" }}
      >
        <div className="mb-4 text-center">
          <div className="flex mb-4 md:mb-10">
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="block w-full border rounded-full p-2 md:mx-24"
            />
          </div>
          <div className="flex mb-4 md:mb-10">
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="block w-full border rounded-full p-2 md:mx-24"
            />
          </div>
          <div className="mb-4">
            <button
              onClick={handleLogin}
              className="bg-pink-600 text-white w-full md:w-1/3 py-1 px-2 rounded-full hover:bg-pink-700 mx-auto"
            >
              Login
            </button>
          </div>
          <div className="text-center mt-4">
            <span className="text-white">Not a User, </span>
            <a
              href="#"
              className="text-pink-600"
              onClick={() => navigate("/register")}
            >
              Register
            </a>
          </div>
          <div className="text-center mt-4">
            <button className="text-pink-700" onClick={() => gLogin()}>
              Sign in with Google 🚀{" "}
            </button>
          </div>
        </div>
        {/* Display error message */}
        {error !== null ? (
          <div className="text-red-600 text-center mt-4">{error}</div>
        ) : null}
      </div>
    </div>
  );
};

export default Login;
