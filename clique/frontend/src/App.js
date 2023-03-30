import { HashRouter as Router, Route, Routes } from "react-router-dom";
import {
  Home,
  Login,
  Register,
  Welcome,
  UploadPage,
  UserVideo,
  UserProfilePage,
  UserProfileEdit,
  UserVideoSearch,
  UserVideoList,
  UserVideoPlay,
  UserPasswordChange,
} from "./pages/user/index";

import {
  AdminHomePage,
  AdminNotify,
  AdminUserView,
  AdminVideoView,
  AdminGenre,
  ViewVideo,
  DeletedVideo,
} from "./pages/Admin/index";

import PrivateRoutes from "./routes/PrivateRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>

        {/* User Panel routes */}

        <Route element={<PrivateRoutes />}>
          <Route element={<Home />} path="/home" exact />
          
          <Route path="/upload" element={<UploadPage />}></Route>
          <Route path="/profile" element={<UserProfilePage />}></Route>
          <Route path="/editProfile" element={<UserProfileEdit />}></Route>
          <Route path="/playing/:videoUrl" element={<UserVideo />}></Route>
          <Route
            path="/search/:searchQuery"
            element={<UserVideoSearch />}
          ></Route>
          <Route path="/videolist" element={<UserVideoList />}></Route>
          <Route path="/profile/:videoUrl" element={<UserVideoPlay />}></Route>
          <Route
            path="/changePassword"
            element={<UserPasswordChange />}
          ></Route>
        </Route>

        {/* Admin Panel routes */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<AdminHomePage />}></Route>
          <Route path="/adminNotify" element={<AdminNotify />}></Route>
          <Route path="/adminUserList" element={<AdminUserView />}></Route>
          <Route path="/adminVideoList" element={<AdminVideoView />}></Route>
          <Route path="/adminGenreList" element={<AdminGenre />}></Route>
          <Route
            path="/adminVideoPlay/:videoUrl"
            element={<ViewVideo />}
          ></Route>
          <Route path="/deletedList" element={<DeletedVideo />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
