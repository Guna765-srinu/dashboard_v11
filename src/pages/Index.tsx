// ✅ Updated Index.tsx with Sidebar Collapse/Expand Feature
import React, { useState } from "react";
// Update the import path below to the correct relative path if needed
import { DashboardProvider, useDashboard } from "../context/DashboardContext";
import Sidebar from "../components/Dashboard/Sidebar";
import SummaryCards from "../components/Dashboard/SummaryCards";
import Charts from "../components/Dashboard/Charts";
import ThemeToggle from "../components/Dashboard/ThemeToggle";
import TicketPanel from "../components/Dashboard/TicketPanel";

// Inner component that uses the context
const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { filters } = useDashboard();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground dark:bg-background dark:text-foreground">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
        {/* Header */}
        <header className="border-b flex items-center px-4 justify-between bg-background dark:bg-card shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <h1 className="font-semibold mt-1 text-3xl tracking-wide text-foreground dark:text-card-foreground">
                Digital Dashboard
              </h1>
              {(filters.startDate || filters.endDate) && (
                <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  (
                  {filters.startDate
                    ? new Date(filters.startDate).toLocaleDateString('en-US')
                    : ''}
                  {filters.startDate && filters.endDate ? ' - ' : ''}
                  {filters.endDate
                    ? new Date(filters.endDate).toLocaleDateString('en-US')
                    : ''}
                  )
                </span>
              )}
            </div>
            <p>Real-time view of Operations, Anywhere Anytime</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground"></p>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 overflow-auto">
          <div className="p-2 space-y-2">
            {/* Sticky Summary Cards */}
            <div className="sticky top-0 z-50 bg-background dark:bg-card pb-2 mb-4 shadow-md">
              <SummaryCards />
            </div>

            {/* Charts */}
            <div className="w-full mb-6">
              <Charts />
            </div>
          </div>
        </div>
      </main>

      {/* Ticket Panel */}
      <TicketPanel />
    </div>
  );
};

// Outer component wraps with provider
const Index = () => (
  <DashboardProvider>
    <DashboardPage />
  </DashboardProvider>
);

export default Index;

