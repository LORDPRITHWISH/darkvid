import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route, RouterProvider } from "react-router";
import Layout from "./Layout.js";
import Home from "./pages/home/Home.js";
import Profile from "./pages/profile/Profile.js";
import Notfound from "./pages/NotFound.js";
import Login from "./pages/login/Login.js";
import Chanel from "./pages/chanel/Chanel.js";
import About from "./pages/about/About.js";
import Direct from "./pages/chanel/Direct.js";
import Video from "./pages/video/Video.js";
import Upload from "./pages/upload/Upload.js";
import Setdata from "./components/Setdata.js";
import HomeLayout from "./components/HomeLayout.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route element={<HomeLayout />} >
        <Route index element={<Home />} />
        <Route path="app" element={<App />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="about" element={<About />} />

      <Route path="@:userid" element={<Profile />} />
      <Route path="chanel/" element={<Outlet />}>
        {/* <Route index element={<Navigate to="/" replace />} /> */}
        <Route index element={<Direct />} />
        <Route path=":userid" element={<Chanel />} />
      </Route>
      <Route path="video/" element={<Outlet />}>
        <Route index element={<Navigate to="/" replace />} />
        <Route path=":userid" element={<Video />} />
      </Route>
      <Route path="tweet/" element={<Profile />}>
        <Route path=":userid" element={<Profile />} />
      </Route>
      <Route path="upload/" element={<Upload />} />
      <Route path="subsciption/" element={<Profile />} />
      <Route path="chat/" element={<Profile />}>
        <Route path=":userid" element={<Profile />} />
      </Route>

      <Route path="*" element={<Notfound />} />
    </Route>
  )
);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
createRoot(rootElement).render(
  <StrictMode>
    <Setdata />
    <RouterProvider router={router} />
  </StrictMode>
);
