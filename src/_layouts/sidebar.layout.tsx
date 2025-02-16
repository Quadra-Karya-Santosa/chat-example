import { NavLink } from "react-router";
import { ChatPath } from "../pages/chat/chat.page";
import { ArticlePath } from "../pages/article/article.page";
import { useAppDispatch } from "../_store";
import { useCallback } from "react";
import { deleteTokenAuth } from "../_store/auth";

interface SidebarProps {
  active: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active }) => {
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(() => {
    dispatch(deleteTokenAuth())
  }, []);

  return (
    <aside
      className={`z-[999] max-h-screen h-screen overflow-auto relative top-0 bg-persian-green transition-all ${active ? "left-0 w-[25%]" : "-left-[20%] w-[0%]"
        }`}
    >
      <h1 className="text-slate-800 font-bold text-center text-3xl p-4">Programmer Toddler</h1>
      <div className="mt-4 px-4">
        <div className="flex flex-col gap-1">
          <NavLink
            to={ChatPath}
            className={({ isActive }) =>
              `hover:bg-blue-200 transition-all duration-500 p-4 cursor-pointer ml-2 rounded-xl text-slate-800 ${isActive ? "bg-blue-100" : ""}`
            }
          >
            Chat
          </NavLink>
          <NavLink
            to={ArticlePath}
            className={({ isActive }) =>
              `hover:bg-blue-200 transition-all duration-500 p-4 cursor-pointer ml-2 rounded-xl text-slate-800 ${isActive ? "bg-blue-100" : ""}`
            }
          >
            Article
          </NavLink>
          <button onClick={handleLogout} className="hover:bg-red-400 transition-all duration-500 p-4 cursor-pointer ml-2 rounded-xl text-slate-800 bg-red-300">Log out</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
