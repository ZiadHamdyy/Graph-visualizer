import React from 'react'

interface StartNodeProps {
    startNode: string;
    setStartNode: (value: string) => void;
}

export default function StartNode({ startNode, setStartNode }: StartNodeProps) {
    return (
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
    )
}
