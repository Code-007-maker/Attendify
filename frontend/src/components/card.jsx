// card.jsx
import { CometCard } from "@/components/ui/comet-card";
import { StudentContext, SubjectContext } from "../contexts/UserContext";
import { useContext } from "react";

export function CometCardDemo({ key1 , id, name, email, count , subject ,subject_id, flag}) {
  const { setSelectedStudent } = useContext(StudentContext);
  const { setSelectedSubject } = useContext(SubjectContext);

  const handleClick = () => {
    if (flag) {
      // this is a class card — set selected class id
      setSelectedStudent(key1);
      setSelectedSubject(subject_id)
    } else {
      // optional: for teacher/student cards do something else
    }
  };

  return (
    <CometCard>
      <button
        onClick={handleClick}
        type="button"
        className="my-10 flex w-60 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:my-20 md:p-4"
      >
        <div className="mx-2 flex-1">
          <div className="relative mt-2 aspect-[3/4] w-full">
            <img
              loading="lazy"
              className="absolute inset-0 h-full w-full rounded-[16px] bg-[#000000] object-cover contrast-75"
              alt={flag ? `Class ${id}` : name}
              src={flag ? "./class.jpg" : "./user.jpg"}
            />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between p-4 font-mono text-white">
          <div className="text-xs">{flag ? `Class : ${id}-${name}` : `Name : ${name}`}</div>
          <div className="text-xs text-gray-300 opacity-50">{flag && subject ? `Subject : ${subject}` : flag ?`students : ${count}` :`id : ${id}`}</div>
        </div>
      </button>
    </CometCard>
  );
}
