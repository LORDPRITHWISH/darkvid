// import React from 'react'

import { Home, Upload, Users, Video } from "lucide-react"
import { NavLink } from "react-router"

const links = [
    { icon: Home, label: "Home" ,link: ""},
    { icon: Users, label: "Users", link: "users" },
    { icon: Upload, label: "Upload", link: "upload" },
    { icon: Video, label: "Video", link: "video" },
]

function Sidelink() {
  return (
    <div className="fixed left-0 top-0 h-screen w-14 mt-8 flex flex-col items-center py-4 z-30">
      {/* <h1 className="text-red-500 font-bold text-xs mb-6">DV</h1> */}
      <div className="flex flex-col gap-8 text-gray-400 mt-12 ml-4">
      {links.map(({ icon: Icon, label, link }) => (
          <NavLink className="hover:text-white cursor-pointer text-gray-400" to={link}>
          <Icon
          key={label}
          size={30}
          aria-label={label}
          />
          <span className="text-xs">{label}</span> 
          </NavLink>
        ))}
        </div>
    </div>
  )
}

export default Sidelink