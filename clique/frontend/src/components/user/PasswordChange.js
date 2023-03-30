import React from "react";
import Header from "../Header";
import { useFormik } from "formik";
import ProfileBar from "./ProfileBar";
import { passwordSchema } from "../../schemas/passwordSchema";
import instance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import "../admin/css/sweetalert.css";

const PasswordChange = () => {
  const userID = useSelector((state) => state.user.user.id);
  console.log(userID);

  const onSubmit = async (values, actions) => {
    try {
      const response = await instance.put(`api/changePassword/${userID}/`, {
        old_password: values.oldPassword,
        password: values.newPassword,
        password2: values.confirmPassword,
      });
      console.log(response);
      if (response.status === 200) {
        console.log(response.status);
        Swal.fire("Password Updated");
      } else {
        console.log(response.status);
        Swal.fire("Error");
      }
    } catch (error) {
      Swal.fire("Invalid Credentials");
      console.log(error);
    }
    actions.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit,
  });
  console.log(formik.errors);

  return (
    <div className="flex flex-col bg-gray-900  p-20  m-6 rounded-[50px] shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] ">
      <div className="flex items-center mb-8">
        <div className="ml-4">
          <h1 className="text-white text-3xl">Password Change</h1>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4 text-center">
          <input
            type="password"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            id="oldPassword"
            placeholder="Current Password"
            className="block w-full border rounded-full p-2 m-2"
            onBlur={formik.handleBlur}
          />
          {formik.errors.oldPassword && formik.touched.oldPassword && (
            <p className="text-sm text-pink-600">{formik.errors.oldPassword}</p>
          )}
          <input
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            id="newPassword"
            placeholder="New Password"
            className="block w-full border rounded-full p-2 m-2"
            onBlur={formik.handleBlur}
          />
          {formik.errors.newPassword && formik.touched.newPassword && (
            <p className="text-sm text-pink-600">{formik.errors.newPassword}</p>
          )}
          <input
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            id="confirmPassword"
            placeholder="Confirm Password"
            className="block w-full border rounded-full p-2 m-2"
            onBlur={formik.handleBlur}
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <p className="text-sm text-pink-600">
              {formik.errors.confirmPassword}
            </p>
          )}

          <button
            type="submit"
            className="bg-pink-600 text-white py-1 px-2 mt-4 rounded-full hover:bg-pink-700 mx-auto"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;
