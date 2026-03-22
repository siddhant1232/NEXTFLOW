import WorkflowCanvas from "@/components/canvas/WorkflowCanvas";
import LeftSidebar from "@/components/sidebar/LeftSidebar";
import RightSidebar from "@/components/sidebar/RightSidebar";

export default function Home() {
  return (
    <div className="flex">
      <LeftSidebar />

      <div className="flex-1">
        <WorkflowCanvas />
      </div>

      <RightSidebar />
    </div>
  );
}