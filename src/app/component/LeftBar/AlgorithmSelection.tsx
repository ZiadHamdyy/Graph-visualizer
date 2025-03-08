import React from 'react'

interface AlgorithmSelectionProps {
  selectedAlgo: string;
  setSelectedAlgo: (value: string) => void;
  setSearching: (value: boolean) => void;
}


export default function AlgorithmSelection({ selectedAlgo, setSelectedAlgo, setSearching }: AlgorithmSelectionProps) {

  return (
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
  )
}
