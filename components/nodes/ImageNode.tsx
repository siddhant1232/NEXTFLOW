"use client";

import { Handle, Position } from "reactflow";
import { useWorkflowStore } from "@/store/useWorkflowStore";

export default function ImageNode({ id, data }: { id: string, data: { image: string } }) {
  const updateNodeData = useWorkflowStore(
    (state) => state.updateNodeData
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const url = URL.createObjectURL(file);

    updateNodeData(id, {
      image: url,
    });
  };

  return (
    <div className="p-3 bg-purple-100 rounded shadow w-52 border">
      

      <Handle type="target" position={Position.Top} />

      <p className="text-sm font-semibold mb-2">Image Node</p>

      <input type="file" onChange={handleUpload} />

      {data.image && (
        <img
          src={data.image}
          alt="preview"
          className="mt-2 w-full h-24 object-cover rounded"
        />
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}