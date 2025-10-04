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
import Upload from "./pages/upload/UploadDetailsEditor.js";
import HomeLayout from "./components/HomeLayout.js";
import { ThemeProvider } from "@/components/theme-provider"
import StudioPage from "./pages/studio/Studio.js";
import UploadVideoPage from "./pages/upload/VideoUpload.js";
import VideoDetailsEditor from "./pages/edit/VideoDetailsEditor.js";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="login" element={<Login />} />
      <Route element={<HomeLayout />} >
        <Route index element={<Home />} />
        <Route path="app" element={<App />} />
      </Route>
      <Route path="about" element={<About />} />

      <Route path="@:userid" element={<Profile />} />
      <Route path="chanel/" element={<Outlet />}>
        {/* <Route index element={<Navigate to="/" replace />} /> */}
        <Route index element={<Direct />} />
        <Route path=":userid" element={<Chanel />} />
      </Route>
      <Route path="video/" element={<Outlet />}>
        <Route index element={<Navigate to="/" replace />} />
        <Route path=":videoid" element={<Video />} />
      </Route>
      <Route path="edit/" element={<Outlet />}>
        <Route index element={<Navigate to="/studio" replace />} />
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
  )
);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
