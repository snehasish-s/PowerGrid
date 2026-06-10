import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral select-none">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-neutral">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
