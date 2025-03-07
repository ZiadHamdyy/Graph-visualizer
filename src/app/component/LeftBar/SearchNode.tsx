import React from 'react'
interface SearchNodeProps {
    searchNode: string;
    setSearchNode: (value: string) => void;
  }

export default function SearchNode({searchNode, setSearchNode}: SearchNodeProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm space-y-3">
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
          </div>
  )
}
