"use client";

import { useState } from "react";
import { ReactFlowProvider } from "reactflow";

import LeftSidebar from "@/components/sidebar/LeftSidebar";
import WorkflowCanvas from "@/components/canvas/WorkflowCanvas";
import RightSidebar from "@/components/sidebar/RightSidebar"; 

export default function ClientWrapper() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen">
        

        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-3 py-2 rounded"
          onClick={() => setMobileOpen(true)}
        >
          ☰
        </button>


        <LeftSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />


        <div className="flex-1 relative">
          <WorkflowCanvas />
        </div>


        <div className="hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </ReactFlowProvider>
  );
}