"use client";
import Image from "next/image";
import menu from "../../menu.png";

interface LeftBarProps {
  isBarOff: boolean;
  setIsBarOff: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeftTopBar({isBarOff, setIsBarOff}: LeftBarProps) {
  return (
    <div className="border-b border-gray-200 bg-white w-full h-16 flex items-center justify-between">
      <div className="p-2">
        <Image
          src={menu}
          alt="Menu icon"
          width={44}
          height={44}
          className="cursor-pointer hover:bg-gray-100 rounded-md p-1 transition-colors duration-200"
          onClick={() => setIsBarOff(!isBarOff)}
        />
      </div>
    </div>
  );
}