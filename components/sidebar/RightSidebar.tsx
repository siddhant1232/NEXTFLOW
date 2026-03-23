"use client";

import { useState } from "react";
import { useWorkflowStore } from "@/store/useWorkflowStore";

export default function RightSidebar() {
  const runs = useWorkflowStore((state) => state.runs);

  const [selectedRun, setSelectedRun] = useState<{
    id: string;
    timestamp: string;
    status: "success" | "error";
    nodes: {
      id: string;
      type: string;
      status: string;
      output?: string;
    }[];
  } | null>(null);

  return (
    <div className="w-60 h-screen bg-[#0f0f0f] border-l border-gray-800 flex flex-col">
      

      <div className="p-4 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-200">
          History
        </h2>
      </div>


      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        
        {runs.length === 0 && (
          <p className="text-gray-500 text-xs">
            No runs yet
          </p>
        )}

        {runs.map((run) => (
          <div
            key={run.id}
            onClick={() => setSelectedRun(run)}
            className={`px-3 py-2 rounded-md cursor-pointer transition border
              ${
                selectedRun?.id === run.id
                  ? "bg-[#1a1a1a] border-gray-600"
                  : "bg-[#111] border-gray-800 hover:bg-[#1a1a1a]"
              }`}
          >
            <p className="text-xs text-gray-300">
              {run.timestamp}
            </p>

            <p
              className={`text-xs font-medium ${
                run.status === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {run.status}
            </p>
          </div>
        ))}
      </div>


      {selectedRun && (
        <div className="border-t border-gray-800 p-3 space-y-3">
          
          <p className="text-xs font-semibold text-gray-400">
            Run Details
          </p>

          {selectedRun.nodes.map((node) => (
            <div
              key={node.id}
              className="flex items-center justify-between bg-[#1a1a1a] border border-gray-700 rounded-md px-3 py-2"
            >
              <span className="text-xs text-gray-300">
                {node.type}
              </span>

              <span
                className={`text-xs font-medium ${
                  node.status === "success"
                    ? "text-green-400"
                    : node.status === "running"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {node.status}
              </span>
            </div>
          ))}


          {selectedRun.nodes.some((n) => n.output) && (
            <div className="mt-2 text-xs text-gray-400 space-y-1">
              {selectedRun.nodes.map(
                (n) =>
                  n.output && (
                    <p key={n.id} className="break-words">
                      {n.output}
                    </p>
                  )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}