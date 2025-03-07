"use client"
import { useState } from "react";
import Graph from "./Graph";
import LeftBar from "./component/LeftBar";
import Json from "./component/Json";

export default function Home() {
  const [isBarOff, setIsBarOff] = useState<boolean>(false);
  const [json, setJson] = useState<boolean>(false);
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      {json ? <Json jsonWindow={json} setJsonWindow={setJson}/> : <></>}
      <LeftBar isBarOff={isBarOff} setIsBarOff={setIsBarOff} jsonWindow={json} setJsonWindow={setJson} />
      <main className="flex-1 p-6">
        <div className={`relative ${isBarOff ? "w-full" : "w-[73.3vw]"} h-[calc(100vh-3rem)] bg-white shadow-lg border border-gray-300 rounded-lg overflow-hidden`}>
          <Graph/>
        </div>
      </main>
    </div>
  );
}