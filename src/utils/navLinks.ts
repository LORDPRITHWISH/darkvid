import { BiHomeAlt2, BiSolidHomeAlt2, BiVideo, BiSolidVideos, BiSolidHome, BiHome } from "react-icons/bi";
import { MdOutlineSubscriptions, MdSubscriptions, MdOutlineExplore, MdExplore, MdOutlineWatchLater, MdWatchLater, MdOutlineHistory, MdHistory, MdOutlinePlaylistPlay, MdPlaylistPlay, MdOutlineWhatshot, MdWhatshot } from "react-icons/md";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";

export const quickLinks = [
  { icon: BiHome, activeIcon: BiSolidHome, label: "Home", link: "" },
  { icon: MdOutlineSubscriptions, activeIcon: MdSubscriptions, label: "Subscriptions", link: "subscriptions" },
  { icon: MdOutlineExplore, activeIcon: MdExplore, label: "Explore", link: "explore" },
  { icon: MdOutlineWhatshot, activeIcon: MdWhatshot, label: "Trending", link: "trending" },
  { icon: MdOutlineWatchLater, activeIcon: MdWatchLater, label: "WatchLater", link: "watchlater" },
  { icon: BiVideo, activeIcon: BiSolidVideos, label: "Library", link: "video" },
  { icon: MdOutlinePlaylistPlay, activeIcon: MdPlaylistPlay, label: "Playlists", link: "playlists" },
  { icon: MdOutlineHistory, activeIcon: MdHistory, label: "History", link: "history" },
  { icon: FaRegUserCircle, activeIcon: FaUserCircle, label: "Profile", link: "profile" },
];

export const navLinks = [
  { icon: BiHomeAlt2, activeIcon: BiSolidHomeAlt2, label: "Home", link: "" },
  { icon: MdOutlineSubscriptions, activeIcon: MdSubscriptions, label: "Subscriptions", link: "subscriptions" },
  { icon: MdOutlineExplore, activeIcon: MdExplore, label: "Explore", link: "explore" },
  { icon: MdOutlineWhatshot, activeIcon: MdWhatshot, label: "Trending", link: "trending" },
  { icon: MdOutlineWatchLater, activeIcon: MdWatchLater, label: "WatchLater", link: "watchlater" },
  { icon: BiVideo, activeIcon: BiSolidVideos, label: "Library", link: "video" },
  { icon: MdOutlinePlaylistPlay, activeIcon: MdPlaylistPlay, label: "Playlists", link: "playlists" },
  { icon: MdOutlineHistory, activeIcon: MdHistory, label: "History", link: "history" },
  { icon: FaRegUserCircle, activeIcon: FaUserCircle, label: "Profile", link: "profile" },
];
