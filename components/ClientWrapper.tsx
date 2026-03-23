"use client";

import { useState } from "react";
import { ReactFlowProvider } from "reactflow"; // ✅ ADD THIS

import LeftSidebar from "@/components/sidebar/LeftSidebar";
import WorkflowCanvas from "@/components/canvas/WorkflowCanvas";

export default function ClientWrapper() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ReactFlowProvider> {/* ✅ IMPORTANT */}
      <div className="flex h-screen">
        
        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-3 py-2 rounded"
          onClick={() => setMobileOpen(true)}
        >
          ☰
        </button>

        {/* SIDEBAR */}
        <LeftSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* CANVAS */}
        <div className="flex-1">
          <WorkflowCanvas />
        </div>
      </div>
    </ReactFlowProvider>
  );
}