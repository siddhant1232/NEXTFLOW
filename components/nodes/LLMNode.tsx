"use client";

import { Handle, Position } from "reactflow";

export default function LLMNode({
  id,
  data,
}: {
  id: string;
  data: {
    output?: string;
    status?: "running" | "success" | "error";
  };
}) {
  return (
    <div className="p-3 bg-yellow-100 rounded shadow w-60 border">
      
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />

      <p className="font-semibold mb-2">LLM Node</p>
      {data?.status === "running" && (
        <p className="text-yellow-600">🟡 Running...</p>
      )}

      {data?.status === "success" && (
        <p className="text-green-600">🟢 Success</p>
      )}

      {data?.status === "error" && (
        <p className="text-red-600">🔴 Error</p>
      )}


      <div className="mt-2 text-sm text-gray-800 break-words">
        {data?.output || "No output yet"}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
    </div>
  );
}