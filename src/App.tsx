// import { StrictMode } from "react";
import "./index.css";
import { createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route, RouterProvider } from "react-router";
import MainLayout from "./layouts/MainLayout.js";
import Home from "./pages/home/Home.js";
import Profile from "./pages/profile/Profile.js";
import Notfound from "./pages/NotFound.js";
import Login from "./pages/auth/Login.js";
import Channel from "./pages/channel/Channel.js";
import About from "./pages/about/About.js";
import Direct from "./pages/channel/Direct.js";
import Video from "./pages/video/Video.js";
import Upload from "./pages/upload/UploadDetailsEditor.js";
import BaseLayout from "./layouts/BaseLayout.js";
import StudioPage from "./pages/studio/Studio.js";
import UploadVideoPage from "./pages/upload/VideoUpload.js";
import VideoDetailsEditor from "./pages/edit/VideoDetailsEditor.js";
import AuthLayout from "./layouts/AuthLayout.js";
import Signup from "./pages/auth/Signup.js";
import Activity from "./pages/watch/Activity.js";
import Subscriptions from "./pages/subscriptions/Subscriptions.js";
import Explore from "./pages/explore/Explore.js";
import Trending from "./pages/trending/Trending.js";
import WatchLater from "./pages/watchlater/WatchLater.js";
import Library from "./pages/library/Library.js";
import Playlists from "./pages/playlists/Playlists.js";
import History from "./pages/history/History.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Outlet />}>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="explore" element={<Explore />} />
          <Route path="trending" element={<Trending />} />
          <Route path="watchlater" element={<WatchLater />} />
          <Route path="library" element={<Library />} />
          <Route path="playlists" element={<Playlists />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="about" element={<About />} />

        <Route path="@:userid" element={<Profile />} />
        <Route path="channel/" element={<Outlet />}>
          {/* <Route index element={<Navigate to="/" replace />} /> */}
          <Route index element={<Direct />} />
          <Route path=":userid" element={<Channel />} />
        </Route>
        <Route path="video/" element={<Outlet />}>
          <Route index element={<Navigate to="/" replace />} />
          <Route path=":videoid" element={<Video />} />
        </Route>
        <Route path="edit/" element={<Outlet />}>
          {/* <Route index element={<Navigate to="/studio" replace />} /> */}
          <Route index element={<Activity />} />
          <Route path=":videoid" element={<VideoDetailsEditor />} />
        </Route>
        <Route path="tweet/" element={<Profile />}>
          <Route path=":userid" element={<Profile />} />
        </Route>
        <Route path="upload/" element={<Outlet />}>
          <Route index element={<UploadVideoPage />} />
          <Route path=":videoid" element={<Upload />} />
        </Route>
        <Route path="studio/" element={<StudioPage />} />
        <Route path="settings/" element={<Profile />} />
        <Route path="subsciption/" element={<Profile />} />
        <Route path="chat/" element={<Profile />}>
          <Route path=":userid" element={<Profile />} />
        </Route>

        <Route path="*" element={<Notfound />} />
      </Route>
    </Route>,
  ),
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
