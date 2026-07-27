//main skeleton of your dashboard pages

/*
It controls:

Sidebar (left menu)
Topbar (top navigation)
Page content (middle area)
*/ 

import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import { getUser } from '../utils/authStorage.js';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);  // sidebar is closed by default 
  const user = getUser(); {/* get user info like admin/customer, if any */}

  //MAIN LAYOUT WRAPPER
  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC]"> {/* sets the background color and text color for the entire dashboard */}
      <Sidebar role={user?.role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> {/* user role (to show correct menu) */ }
      <div className="lg:pl-72"> {/* this is the main content area, it has padding on the left for large screens to accommodate the sidebar */}
        <Topbar user={user} onMenuClick={() => setSidebarOpen(true)} /> {/* top navigation bar, it has a menu button to open the sidebar on mobile */}
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
