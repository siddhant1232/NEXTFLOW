"use client";

import { useState } from "react";
import LeftSidebar from "@/components/sidebar/LeftSidebar";
import WorkflowCanvas from "@/components/canvas/WorkflowCanvas";

export default function ClientWrapper() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
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

      <div className="flex-1">
        <WorkflowCanvas />
      </div>
    </div>
  );
}