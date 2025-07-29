// import { NavLink } from "react-router";
import { useTester } from "@/store/testStore";

const Footer = () => {
  const { count } = useTester();
  return (
    <div className="bg-blue-900 w-full">
      <div className="flex flex-col justify-center items-center p-1">
        <p className="text-white text-lg font-bold">coyright @Dark</p>
        <p className="text-white text-lg">Current Count: {count}</p>

      </div>
    </div>
  );
};

export default Footer;
