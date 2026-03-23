"use client";

import { useWorkflowStore } from "@/store/useWorkflowStore";
import { useUser, UserButton } from "@clerk/nextjs";
import { useState, type Dispatch, type SetStateAction } from "react";

type LeftSidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
};

export default function LeftSidebar({ mobileOpen, setMobileOpen }: LeftSidebarProps) {
  const addNode = useWorkflowStore((state) => state.addNode);
  const { user } = useUser();

  const [collapsed, setCollapsed] = useState(false);

  const createNode = (type: string) => {
    addNode({
      id: Date.now().toString(),
      type,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: {},
    });

    // Close the mobile drawer after selecting a node type.
    setMobileOpen(false);
  };

  return (
       <div
        className={`
          fixed md:relative z-40 h-screen bg-[#0f0f0f] text-white border-r border-gray-800
          transition-all duration-300 flex flex-col
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "left-0" : "-left-full"} md:left-0
        `}
      >
      {/* TOP */}
      <div>
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-lg font-semibold">Nodes</h2>
          )}

          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        {/* NODES */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => createNode("textNode")}
            className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded"
          >
            {collapsed ? "➕" : "➕ Text Node"}
          </button>

          <button
            onClick={() => createNode("llmNode")}
            className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded"
          >
            {collapsed ? "🤖" : "🤖 LLM Node"}
          </button>

          <button
            onClick={() => createNode("imageNode")}
            className="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded"
          >
            {collapsed ? "🖼️" : "🖼️ Image Node"}
          </button>

          <button
            onClick={() => createNode("cropNode")}
            className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded"
          >
            {collapsed ? "✂️" : "✂️ Crop Node"}
          </button>
        </div>
      </div>

      {/* 🔥 BOTTOM PROFILE */}
      <div className="mt-auto pt-4 border-t border-gray-800 flex items-center gap-2">
        <UserButton />

        {!collapsed && (
          <div className="text-xs">
            <p>{user?.firstName}</p>
          </div>
        )}
      </div>
    </div>
  );
}