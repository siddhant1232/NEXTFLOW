"use client";

import { useWorkflowStore } from "@/store/useWorkflowStore";
import { useUser, UserButton } from "@clerk/nextjs";
import { useState, type Dispatch, type SetStateAction } from "react";

type LeftSidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
};

export default function LeftSidebar({
  mobileOpen,
  setMobileOpen,
}: LeftSidebarProps) {
  const addNode = useWorkflowStore((state) => state.addNode);
  const { user } = useUser();

  const [collapsed, setCollapsed] = useState(false);

  // ---------------- DRAG ----------------
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // ---------------- CLICK ----------------
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

    setMobileOpen(false);
  };

  // ---------------- STYLES ----------------
  const buttonBase =
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium bg-[#1a1a1a] hover:bg-[#222] border border-gray-700 hover:scale-[1.02] active:scale-[0.98]";

  const iconStyle = "w-2 h-2 rounded-full";

  return (
    <div
      className={`
        fixed md:relative z-40 h-screen bg-[#0f0f0f] text-white border-r border-gray-800
        transition-all duration-300 flex flex-col
        ${collapsed ? "w-16" : "w-64"}
        ${mobileOpen ? "left-0" : "-left-full"} md:left-0
      `}
    >
      <div className="p-4 flex flex-col h-full">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-lg font-semibold tracking-tight">
              Nodes
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition"
          >
            {collapsed ? "➡" : "⬅"}
          </button>
        </div>

        {/* NODE BUTTONS */}
        <div className="flex flex-col gap-2">
          
          {/* TEXT */}
          <button
            draggable
            onDragStart={(e) => onDragStart(e, "textNode")}
            onClick={() => createNode("textNode")}
            className={buttonBase}
          >
            <div className={`${iconStyle} bg-gray-400`} />
            {!collapsed && <span className="text-gray-200">Text Node</span>}
          </button>

          {/* LLM */}
          <button
            draggable
            onDragStart={(e) => onDragStart(e, "llmNode")}
            onClick={() => createNode("llmNode")}
            className={buttonBase}
          >
            <div className={`${iconStyle} bg-blue-500`} />
            {!collapsed && <span className="text-gray-200">LLM Node</span>}
          </button>

          {/* IMAGE */}
          <button
            draggable
            onDragStart={(e) => onDragStart(e, "imageNode")}
            onClick={() => createNode("imageNode")}
            className={buttonBase}
          >
            <div className={`${iconStyle} bg-purple-500`} />
            {!collapsed && <span className="text-gray-200">Image Node</span>}
          </button>

          {/* CROP */}
          <button
            draggable
            onDragStart={(e) => onDragStart(e, "cropNode")}
            onClick={() => createNode("cropNode")}
            className={buttonBase}
          >
            <div className={`${iconStyle} bg-green-500`} />
            {!collapsed && <span className="text-gray-200">Crop Node</span>}
          </button>
        </div>

        {/* SPACER */}
        <div className="flex-1" />

        {/* PROFILE */}
        <div className="border-t border-gray-800 pt-4 flex items-center gap-3">
          <UserButton />

          {!collapsed && (
            <div className="text-xs leading-tight">
              <p className="font-medium">{user?.firstName}</p>
              <p className="text-gray-400">Signed in</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}