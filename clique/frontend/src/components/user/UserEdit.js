import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit } from "@fortawesome/free-solid-svg-icons";
import Header from "../Header";
import { useFormik } from "formik";
import { setUserDetails } from "../../redux/authSlice";
import PasswordChange from "./PasswordChange";
import instance from "../../utils/axiosInstance";
import ProfileBar from "./ProfileBar";

const UserEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const userData = useSelector((state) => state.user.user);
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    onSubmit: async (values, action) => {
      try {
        const response = await instance.patch(
          "api/update/",
          {
            first_name: values.firstName,
            last_name: values.lastName,
          },
          {
            headers: headers,
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          dispatch(setUserDetails(response.data));
          navigate("/profile");
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  console.log(formik.errors);

  return (
    <div className="bg-gray-800 min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row bg-gray-800">
        <ProfileBar />
        <div className="flex flex-col bg-gray-900 p-8 lg:p-20 m-4 lg:m-6 rounded-lg shadow-xl lg:rounded-3xl lg:shadow-2xl lg:flex-1">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-400 w-full h-full"
              />
            </div>
            <div className="ml-4">
              <h1 className="text-white text-3xl lg:text-4xl">Edit Profile</h1>
              <p className="text-gray-400 text-base lg:text-lg">
                Update your personal information
              </p>
            </div>
          </div>
          <div className="flex-1 flex-col text-center">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <div className="flex flex-col lg:flex-row mb-10">
                  <div className="w-full lg:w-1/2 lg:mr-2">
                    <input
                      type="text"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      id="firstName"
                      placeholder="First Name"
                      className="w-3/4 border mb-4 rounded-full p-2 text-base lg:text-lg"
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.firstName && formik.touched.firstName && (
                      <p className="text-sm text-pink-600">
                        {formik.errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="lg:w-1/2 lg:ml-2">
                    <input
                      type="text"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      id="lastName"
                      placeholder="Last Name"
                      className="w-3/4 border rounded-full p-2 text-base lg:text-lg"
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.lastName && formik.touched.lastName && (
                      <p className="text-sm text-pink-600">
                        {formik.errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row mb-10">
                  <div className="w-full lg:w-1/2 lg:mr-2">
                    <input
                      type="email"
                      value={userData.email}
                      id="email"
                      placeholder="Email"
                      className="w-3/4 mb-4 border rounded-full p-2 text-base lg:text-lg"
                      disabled
                    />
                  </div>
                  <div className="lg:w-1/2 lg:ml-2">
                    <input
                      type="tel"
                      value={userData.phonenumber}
                      id="phoneNumber"
                      placeholder="Phone Number"
                      className="w-3/4 border rounded-full p-2 text-base lg:text-lg"
                      disabled
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-pink-600 text-white g:w-1/3 py-2 lg:py-1 px-4 lg:px-2 rounded-full hover:bg-pink-700 mx-auto"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
        <PasswordChange />
      </div>
    </div>
  );
};

export default UserEdit;
