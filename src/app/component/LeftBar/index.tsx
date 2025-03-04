"use client";
import React, { useState } from 'react'
import LeftTopBar from './LeftTopBar';

import { useDispatch } from 'react-redux';
import { addEdge, addElement, deleteEdge, deleteElement } from '../../Redux/graphSlice';

interface LeftBarProps {
  isBarOff: boolean;
  setIsBarOff: React.Dispatch<React.SetStateAction<boolean>>;
  json: boolean;
  setJson: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeftBar({ isBarOff, setIsBarOff, json, setJson }: LeftBarProps) {
  const [selectedGraph, setSelectedGraph] = useState('tree');
  const [selectedAlgo, setSelectedAlgo] = useState('');
  const [timer, setTimer] = useState(0);
  const [nodeId, setNodeId] = useState('');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const dispatch = useDispatch();
  const AddNewNode = () => {
    if (!nodeId.trim()) return; // Check if nodeId is empty

    dispatch(addElement({
      group: 'nodes',
      data: { id: nodeId },
      // position: { x: 0, y: 0 } // Initial position will be adjusted by the layout
    }));

    setNodeId('');
  };
  const DeleteNode = () => {
    if (!nodeId.trim()) return; // Check if nodeId is empty

    dispatch(deleteElement(nodeId));

    setNodeId('');
  };

  const AddEdge = () => {
    if (!sourceNode.trim() || !targetNode.trim()) return;

    dispatch(addEdge({
      group: 'edges',
      data: { id: `${sourceNode}${targetNode}`, source: sourceNode, target: targetNode },
      // position: { x: 0, y: 0 } // Initial position will be adjusted by the layout
    }));

    setSourceNode('');
    setTargetNode('');
  };
  const DeleteEdge = () => {
    if (!sourceNode.trim() || !targetNode.trim()) return;

    dispatch(deleteEdge(`${sourceNode}${targetNode}`));

    setSourceNode('');
    setTargetNode('');
  };
  return (
    <div
      className={`${isBarOff ? "w-16" : "w-72"
        } h-screen bg-white border-r border-gray-200 
      shadow-md transition-all duration-300 ease-in-out
      flex flex-col overflow-hidden shrink-0`}
    >
      <LeftTopBar isBarOff={isBarOff} setIsBarOff={setIsBarOff} />

      {!isBarOff && (
        <div className="flex flex-col p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 
        scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 transition-colors duration-200">
          {/* Node Management */}
          <div className="bg-white rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <label className="text-base font-medium text-gray-800">Node Management</label>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
                placeholder="Enter node ID..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                text-gray-900 placeholder-gray-400 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={AddNewNode}
                  className="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-green-500 rounded-xl
                  hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-green-500 transition-colors duration-200"
                >
                  Add
                </button>
                <button
                  onClick={DeleteNode}
                  className="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl
                  hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-red-500 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          {/* Edge Management */}
          <div className="bg-white rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <label className="text-base font-medium text-gray-800">Edge Management</label>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={sourceNode}
                onChange={(e) => setSourceNode(e.target.value)}
                placeholder="Source Node"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                text-gray-900 placeholder-gray-400 text-sm"
              />
              <input
                type="text"
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
                placeholder="Target Node"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                text-gray-900 placeholder-gray-400 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={AddEdge}
                  className="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-green-500 rounded-xl
                  hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-green-500 transition-colors duration-200"
                >
                  Add Edge
                </button>
                <button
                  onClick={DeleteEdge}
                  className="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl
                  hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-red-500 transition-colors duration-200"
                >
                  Del Edge
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setJson(!json)}
            className="w-full px-6 py-2.5 mb-3 text-sm font-medium text-white bg-green-500 rounded-xl
            hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-green-500 transition-colors duration-200"
          >
            Draw Json
          </button>


          {/* Graph Type Selection */}
          <div className="bg-white rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <label className="text-base font-medium text-gray-800">Graph Type</label>
            </div>
            <select
              value={selectedGraph}
              onChange={(e) => setSelectedGraph(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              text-gray-900 text-sm"
            >
              <option value="tree">Tree</option>
              <option value="graph">Graph</option>
              {/* <option value="directedGraph">Directed Graph</option> */}
              {/* <option value="weightedGraph">Weighted Graph</option> */}
              {/* <option value="weightedDirectedGraph">Weighted Directed Graph</option> */}
            </select>
          </div>

          {/* Algorithm Selection */}
          <div className="bg-white rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <label className="text-base font-medium text-gray-800">Algorithm</label>
            </div>
            <select
              value={selectedAlgo}
              onChange={(e) => setSelectedAlgo(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              text-gray-900 text-sm"
            >
              <option value="">Select Algorithm</option>
              <option value="bfs">Breadth First Search (BFS)</option>
              <option value="dfs">Depth First Search (DFS)</option>
              <option value="dijkstra">Dijkstra&apos;s Algorithm</option>
              <option value="bellmanFord">Bellman-Ford Algorithm</option>
              <option value="prim">Prim&apos;s Algorithm</option>
              <option value="kruskal">Kruskal&apos;s Algorithm</option>
            </select>
          </div>


          {/* Timer Section */}
          <div className="bg-white rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <label className="text-base font-medium text-gray-800">Timer (ms)</label>
            </div>
            <input
              type="number"
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
              min="0"
              step="5"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              text-gray-900 text-sm"
            />
          </div>

          {/* Start Button */}
          <button
            onClick={() => {/* Add your start logic here */ }}
            className="w-full px-6 py-2.5 mb-3 text-sm font-medium text-white bg-green-500 rounded-xl
            hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-green-500 transition-colors duration-200"
          >
            Start Algorithm
          </button>

        </div>
      )}
    </div>
  )
}