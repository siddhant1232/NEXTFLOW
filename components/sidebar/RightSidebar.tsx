"use client";

import { useState } from "react";
import { useWorkflowStore } from "@/store/useWorkflowStore";

export default function RightSidebar() {
  const runs = useWorkflowStore((state) => state.runs);
  const [selectedRun, setSelectedRun] = useState<{ id: string; timestamp: string; status: "success" | "error"; nodes: { id: string; type: string; status: string; output?: string }[] } | null>(null);

  return (
    <div className="w-72 h-screen bg-[#111] text-white p-4 border-l border-gray-800 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">History</h2>


      <div className="flex flex-col gap-2">
        {runs.map((run) => (
          <div
            key={run.id}
            onClick={() => setSelectedRun(run)}
            className="p-2 bg-gray-800 rounded text-sm cursor-pointer hover:bg-gray-700"
          >
            <p>{run.timestamp}</p>
            <p
              className={
                run.status === "success"
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {run.status}
            </p>
          </div>
        ))}
      </div>
      {runs.length === 0 && (
        <p className="text-gray-500 text-sm">
          No workflow runs yet. Click &quot;Run Workflow&quot;.
        </p>
      )}
      {selectedRun && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">
            Run Details
          </h3>

          <div className="flex flex-col gap-2">
            {selectedRun.nodes.map((node: { id: string; type: string; status: string; output?: string }) => (
              <div
                key={node.id}
                className="p-2 bg-gray-900 rounded text-xs"
              >
                <p className="font-semibold">
                  {node.type}
                </p>

                <p
                  className={
                    node.status === "success"
                      ? "text-green-400"
                      : node.status === "running"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }
                >
                  {node.status}
                </p>

                {node.output && (
                  <p className="mt-1 text-gray-300 break-words">
                    {node.output}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}