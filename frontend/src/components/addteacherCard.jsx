import { CometCard } from "@/components/ui/comet-card";
import { Plus } from "lucide-react"; // shadcn/lucide icon
import { AddTeacher } from "./AddTeacher";

export function AddTeacherCard({ onAdd }) {
  return (
    <CometCard>
      <button
        onClick={onAdd}
        type="button"
        className="my-10 flex w-55 h-90 flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-gray-600 bg-[#1F2121] p-8 hover:border-white hover:bg-[#2a2c2c] transition-all duration-300 md:my-20 md:p-10"
        aria-label="Add Teacher"
        style={{
          transformStyle: "preserve-3d",
          transform: "none",
          opacity: 1,
        }}
      >
        <div className="flex flex-col items-center justify-center text-white">
          <Plus className="h-12 w-12 text-gray-300" />
          <p className="mt-3 text-sm font-semibold text-gray-400">
            <AddTeacher/>
          </p>
        </div>
      </button>
    </CometCard>
  );
}
