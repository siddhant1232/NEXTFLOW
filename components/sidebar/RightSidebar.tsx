"use client";

import { useWorkflowStore } from "@/store/useWorkflowStore";

export default function RightSidebar() {
  const runs = useWorkflowStore((state) => state.runs);

  return (
    <div className="w-64 h-screen bg-[#111] text-white p-4 border-l border-gray-800">
      <h2 className="text-lg font-semibold mb-4">History</h2>

      {runs.length === 0 && (
        <p className="text-gray-500 text-sm">No runs yet</p>
      )}

      <div className="flex flex-col gap-2">
        {runs.map((run) => (
          <div
            key={run.id}
            className="p-2 bg-gray-800 rounded text-sm"
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
    </div>
  );
}