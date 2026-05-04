// import { NavLink } from "react-router";
// import { useTester } from "@/store/testStore";

const Footer = () => {
  // const { count } = useTester();
  return (
    <div className="bg-slate-950/60 w-full">
      <div className="flex flex-col justify-center items-center p-1">
        <p onClick={() => window.open("https://github.com/LORDPRITHWISH", "_blank")} className="text-slate-400/60 hover:text-slate-300 transition-colors duration-200 text-md cursor-pointer">coyright @LORDPRITHWISH</p>
        {/* <p className="text-white text-lg">Current Count: {count}</p> */}

      </div>
    </div>
  );
};

export default Footer;
