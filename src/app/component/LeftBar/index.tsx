"use client";
import React, { useCallback, useEffect, useState } from 'react'
import LeftTopBar from './LeftTopBar';

import { useDispatch, useSelector } from 'react-redux';
import { selectAllElements, selectCurrentGraph } from '../../Redux/graphSlice';
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
import NodeManagement from './NodeManagement';
import EdgeManagement from './EdgeManagement';
import AlgorithmSelection from './AlgorithmSelection';
import Delay from './Delay';
import StartNode from './StartNode';
import SearchNode from './SearchNode';

interface LeftBarProps {
  isBarOff: boolean;
  setIsBarOff: React.Dispatch<React.SetStateAction<boolean>>;
  jsonWindow: boolean;
  setJsonWindow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeftBar({ isBarOff, setIsBarOff, jsonWindow, setJsonWindow }: LeftBarProps) {
  const [delay, setDelay] = useState(0);

  const [searchNode, setSearchNode] = useState('');
  const [startNode, setStartNode] = useState('');

  const [started, setStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [searching, setSearching] = useState<boolean>(false);

  const [selectedAlgo, setSelectedAlgo] = useState('');

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
      const completed = await iterateAndHighlight(Array.isArray(traversalArray) ? traversalArray : traversalArray.result, delay);
      if (completed && 'found' in traversalArray) {
        if (traversalArray.found) {
          elementFound(searchNode);
          toast.success('Element found');
        } else {
          toast.error('Element not found');
        }
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
    toast.success(isPaused ? "Resumed" : "Paused", {
      icon: isPaused ? '▶️' : '⏸️'
    });
  };

  const handleReset = () => {
    resetElement();
    setStarted(false);
    setIsPaused(false);
    setIsVisualizing(false);
    toast.success("Visualization reset", {
      icon: '🔄'
    });
  };

    const updateGraphJson = useCallback(() => {
    const treeData = graphTojson(elements as GraphElement[]);
    if (!treeData) return;
    const jsonString = JSON.stringify(treeData, null, 2);
    dispatch(setJson(jsonString));
  }, [elements, dispatch]);

  useEffect(() => {
    if (elements.length > 0) {
      updateGraphJson();
    }
  }, [elements, updateGraphJson]);

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
          <NodeManagement />

          {/* Edge Management */}
          <EdgeManagement />
          <button
            onClick={() => setJsonWindow(!jsonWindow)}
            className="w-full px-6 py-2.5 mb-3 text-sm font-medium text-white bg-green-500 rounded-xl
            hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-green-500 transition-colors duration-200"
          >
            Draw Json
          </button>


          {/* Algorithm Selection */}
          <AlgorithmSelection selectedAlgo={selectedAlgo} setSelectedAlgo={setSelectedAlgo} setSearching={setSearching} />


          {/* Delay Section */}
          <Delay delay={delay} setDelay={setDelay} />



          {/* Start Node Section */}
          <StartNode startNode={startNode} setStartNode={setStartNode} />
          {/* Search Node Section */}
          {searching && <SearchNode searchNode={searchNode} setSearchNode={setSearchNode} />}

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