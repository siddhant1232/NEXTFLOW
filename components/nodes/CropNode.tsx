"use client";

import { Handle, Position } from "reactflow";

export default function CropNode({ id, data }: { id: string, data: { image: string } }) {
  return (
    <div className="p-3 bg-green-100 rounded shadow w-60 border">
      
      <Handle type="target" position={Position.Top} />

      <p className="font-semibold mb-2">Crop Node</p>

      <p className="text-sm text-gray-600">
        Simulated crop (center)
      </p>

      {data.image && (
        <img
          src={data.image}
          className="mt-2 w-full h-24 object-cover rounded"
        />
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}