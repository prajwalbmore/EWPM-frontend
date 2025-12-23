import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main
          className="
            flex-1
            w-full
            p-3 sm:p-4 md:p-6 lg:p-8
            mt-16
            md:ml-64
            transition-all duration-300 ease-in-out
            min-h-[calc(100vh-4rem)]
          "
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Header from './Header';

// const Layout = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <div className="flex">
//         <Sidebar />
//         <main className="flex-1 p-6 ml-64 mt-16">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

