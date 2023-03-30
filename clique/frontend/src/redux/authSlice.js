import { createSlice } from "@reduxjs/toolkit";
import instance from "../utils/axiosInstance";
import jwt_decode from "jwt-decode";

const authSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {
    login: (state, action) => {
      const user = {
        id: action.payload.id,
        username: action.payload.username,
        firstname: action.payload.first_name,
        lastname: action.payload.last_name,
        email: action.payload.email,
        phonenumber: action.payload.phone_number,
        isAdmin: action.payload.is_superuser,
        isLoggedIn: true,
      };
      const token = {
        access: action.payload.access,
        refresh: action.payload.refresh,
      };
      console.log(user);
      try {
        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
        localStorage.setItem("email", action.payload.email);
        return {
          ...state,
          user,
          token,
        };
      } catch (error) {
        console.error(error);
      }
    },
    setError: (state, action) => {
      state.error = action.payload.message;
    },

    setUserDetails: (state, action) => {
      state.user = {
        ...state.user,
        firstname: action.payload.first_name,
        lastname: action.payload.last_name,
      };
    },
    GLogin: (state, action) => {
      const user = {
        id: action.payload.user.id,
        username: action.payload.user.username,
        firstname: action.payload.user.first_name,
        lastname: action.payload.user.last_name,
        email: action.payload.user.email,
        phonenumber: action.payload.user.phone_number,
        isAdmin: action.payload.user.is_superuser,
        isLoggedIn: true,
      };
      const token = {
        access: action.payload.access,
        refresh: action.payload.refresh,
      };

      try {
        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
        localStorage.setItem("email", action.payload.user.email);
        return {
          ...state,
          user,
          token,
        };
      } catch (error) {
        console.error(error);
      }
    },
    logOut: (state)=>{
      const user={
        isLoggedIn: false,
      }
      const token={}
      try {
        localStorage.clear()
        return {
          ...state,
          user,
          token,
        };
      } catch (error) {
        console.error(error);
      }

    }
  },
});

export const { login, setError, setUserDetails, GLogin } = authSlice.actions;

export const loginUser = (email, password) => async (dispatch) => {
  try {
    const res = await instance.post("api/login/", {
      email: email,
      password: password,
    });
    if (res.status === 200) {
      console.log(res.data);
      const access = res.data.access;
      const isAdmin = res.data.is_superuser;
      dispatch(login(res.data));
      return { access, isAdmin };
    }
  } catch (err) {
    console.error(err);
    console.log(err.response.data);
    if (err.response.status === 401) {
      dispatch(setError({ message: "Invalid credentials" }));
    }
  }
};

export default authSlice.reducer;
