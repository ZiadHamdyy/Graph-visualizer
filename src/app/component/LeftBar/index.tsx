"use client";
import React, { useEffect, useState } from 'react'
import LeftTopBar from './LeftTopBar';

import { useDispatch, useSelector } from 'react-redux';
import { addEdge, addElement, deleteEdge, deleteElement, selectAllElements, selectCurrentGraph } from '../../Redux/graphSlice';
import { useGraphHighlight } from '@/app/Graph/GraphControllers';
import { selectJson, setJson } from '@/app/Redux/jsonSlice';
import { jsonToHash } from '@/app/utils/hashParse';
import toast from 'react-hot-toast';
import { GraphElement, graphTojson } from '@/app/utils/JsonParse';
import { preOrderTraversal } from '@/app/algorithms/traversal/PreOrder';
import { inOrderTraversal } from '@/app/algorithms/traversal/InOrder';
import { postOrderTraversal } from '@/app/algorithms/traversal/PostOrder';
import { bfs } from '@/app/algorithms/search/bfs';
import { dfs } from '@/app/algorithms/search/dfs';

interface LeftBarProps {
  isBarOff: boolean;
  setIsBarOff: React.Dispatch<React.SetStateAction<boolean>>;
  jsonWindow: boolean;
  setJsonWindow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeftBar({ isBarOff, setIsBarOff, jsonWindow, setJsonWindow }: LeftBarProps) {
  const [selectedAlgo, setSelectedAlgo] = useState('');
  const [timer, setTimer] = useState(0);
  const [nodeId, setNodeId] = useState('');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [searchNode, setSearchNode] = useState('');
  const [startNode, setStartNode] = useState('');

  const [started, setStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [searching, setSearching] = useState<boolean>(false);

  const dispatch = useDispatch();

  const currentGraph = useSelector(selectCurrentGraph);
  const currentJson = useSelector(selectJson);
  const elements = useSelector(selectAllElements);

  const { iterateAndHighlight, resetElement, togglePause, elementFound } = useGraphHighlight(currentGraph);

  const handleVisualize = async () => {
    if (started) return;
    if (!currentJson) {
      toast.error('Please draw a graph first', {
        style: {
          backgroundColor: "#FEE2E2",
          border: "1px solid #EF4444",
          color: "#DC2626",
          fontWeight: "500",
        },
      });
      return;
    }
    if (!selectedAlgo) {
      toast.error('Please select an algorithm', {
        style: {
          backgroundColor: "#FEE2E2",
          border: "1px solid #EF4444",
          color: "#DC2626",
          fontWeight: "500",
        },
      });
      return;
    }
    if (!startNode) {
      toast.error('Please enter a start node', {
        style: {
          backgroundColor: "#FEE2E2",
          border: "1px solid #EF4444",
          color: "#DC2626",
          fontWeight: "500",
        },
      });
      return;
    }

    try {
      setIsVisualizing(true);
      setStarted(true);
      setIsPaused(false);

      const hash = jsonToHash(JSON.parse(currentJson));

      let traversalArray;

      switch (selectedAlgo) {
        case 'bfs':
          if (!searchNode) {
            toast.error('Please enter a search node', {
              style: {
                backgroundColor: "#FEE2E2",
                border: "1px solid #EF4444",
                color: "#DC2626",
                fontWeight: "500",
              },
            });
            return;
          }
          traversalArray = bfs(hash, startNode, searchNode);
          break;
        case 'dfs':
          if (!searchNode) {
            toast.error('Please enter a search node', {
              style: {
                backgroundColor: "#FEE2E2",
                border: "1px solid #EF4444",
                color: "#DC2626",
                fontWeight: "500",
              },
            });
            return;
          }
          traversalArray = dfs(hash, startNode, searchNode);
          break;
        case 'pre':
          traversalArray = preOrderTraversal(hash, startNode);
          break;
        case 'in':
          traversalArray = inOrderTraversal(hash, startNode);
          break;
        case 'post':
          traversalArray = postOrderTraversal(hash, startNode);
          break;
        default:
          throw new Error('Invalid algorithm selected');
      }
      resetElement();
      await iterateAndHighlight(Array.isArray(traversalArray) ? traversalArray : traversalArray.result, timer);
      if ('found' in traversalArray && traversalArray.found) {
        elementFound(searchNode);
        toast.success('Element found');
      } else if ('found' in traversalArray && traversalArray.found === false) {
        toast.error('Element not found');
      }

    } catch (error) {
      console.error('Visualization error:', error);
      toast.error('Visualization failed');
    } finally {
      setIsVisualizing(false);
      setStarted(false);
    }
  };

  const handlePause = () => {
    if (!isVisualizing) {
      toast.error("No visualization running");
      return;
    }
    togglePause();
    setIsPaused((prev) => !prev);
    toast.success(isPaused ? "Resumed" : "Paused");
  };

  const handleReset = () => {
    resetElement();
    setStarted(false);
    setIsPaused(false);
    setIsVisualizing(false);
    toast.success("Visualization reset");
  };

  const updateGraphJson = () => {
    const treeData = graphTojson(elements as GraphElement[]);
    if (!treeData) return;
    const jsonString = JSON.stringify(treeData, null, 2);
    dispatch(setJson(jsonString));
  };
  useEffect(() => {
    if (elements.length > 0) {
      updateGraphJson();
    }
  }, [elements, dispatch])

  const AddNewNode = () => {
    if (!nodeId.trim()) return;

    dispatch(addElement({
      group: 'nodes',
      data: { id: nodeId },
    }));
    const treeData = graphTojson(elements as GraphElement[]);
    if (!treeData) return;

    const jsonString = JSON.stringify(treeData, null, 2);
    dispatch(setJson(jsonString));
    setNodeId('');
  };
  const DeleteNode = () => {
    if (!nodeId.trim()) return;

    dispatch(deleteElement(nodeId));

    setNodeId('');
  };

  const AddEdge = () => {
    if (!sourceNode.trim() || !targetNode.trim()) return;

    dispatch(addEdge({
      group: 'edges',
      data: { id: `${sourceNode}${targetNode}`, source: sourceNode, target: targetNode },
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
            onClick={() => setJsonWindow(!jsonWindow)}
            className="w-full px-6 py-2.5 mb-3 text-sm font-medium text-white bg-green-500 rounded-xl
            hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-green-500 transition-colors duration-200"
          >
            Draw Json
          </button>


          {/* Algorithm Selection */}
          <div className="bg-white rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <label className="text-base font-medium text-gray-800">Algorithm</label>
            </div>
            <select
              value={selectedAlgo}
              onChange={(e) => {
                setSelectedAlgo(e.target.value)
                setSearching(e.target.value === 'bfs' || e.target.value === 'dfs');
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              text-gray-900 text-sm"
            >
              <option value="">Select Algorithm</option>
              <option value="bfs">Breadth First Search (BFS)</option>
              <option value="dfs">Depth First Search (DFS)</option>
              <option value="pre">Pre Order Traversal</option>
              <option value="in">In Order Traversal</option>
              <option value="post">Post Order Traversal</option>
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
              step="100"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              text-gray-900 text-sm"
            />
          </div>



          {/* Start Node Section */}
          <div className="bg-white rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <label className="text-base font-medium text-gray-800">Start Node</label>
            </div>
            <input
              type="text"
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              placeholder="Enter start node..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
      text-gray-900 placeholder-gray-400 text-sm"
            />
          </div>

          {searching && <div className="bg-white rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <label className="text-base font-medium text-gray-800">Search Node</label>
            </div>
            <input
              type="text"
              value={searchNode}
              onChange={(e) => setSearchNode(e.target.value)}
              placeholder="Enter node to search..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
      text-gray-900 placeholder-gray-400 text-sm"
            />
          </div>}

          {/* Start Button */}
          <button
            onClick={handleVisualize}
            className="w-full px-6 py-2.5 mb-3 text-sm font-medium text-white bg-green-500 rounded-xl
            hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-green-500 transition-colors duration-200"
          >
            Start Algorithm
          </button>

          <button
            onClick={handlePause}
            className="w-full px-6 py-2.5 mb-3 text-sm font-medium text-white bg-blue-500 rounded-xl
    hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-blue-500 transition-colors duration-200"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={handleReset}
            className="w-full px-6 py-2.5 mb-3 text-sm font-medium text-white bg-red-500 rounded-xl
    hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-red-500 transition-colors duration-200"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}