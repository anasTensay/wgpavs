import { useSelector } from "react-redux";

const TopNavbar = ({ onMenuClick }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Mobile Menu Button */}
      <button
        className=" text-indigo-600 text-2xl"
        onClick={onMenuClick}
        aria-label="Open Menu"
      >
        ☰
      </button>
      <div className="flex items-center gap-5">
        <h1>{currentUser.name}</h1>
        <img src={currentUser.profilePicture} className="w-10 h-10 rounded-full"/>
      </div>
    </header>
  );
};

export default TopNavbar;
