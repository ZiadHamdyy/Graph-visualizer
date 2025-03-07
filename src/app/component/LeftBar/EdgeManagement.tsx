import { deleteEdge, addEdge } from '@/app/Redux/graphSlice';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

export default function EdgeManagement() {
    const [sourceNode, setSourceNode] = useState('');
    const [targetNode, setTargetNode] = useState('');

    const dispatch = useDispatch();

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
    )
}
