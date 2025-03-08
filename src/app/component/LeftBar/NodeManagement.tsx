"use client"
import { addElement, deleteElement, selectAllElements } from '@/app/Redux/graphSlice';
import { setJson } from '@/app/Redux/jsonSlice';
import { GraphElement, graphTojson } from '@/app/utils/JsonParse';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function NodeManagement() {
  const [nodeId, setNodeId] = useState('');

  const dispatch = useDispatch();

  const elements = useSelector(selectAllElements);

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

  return (
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
  )
}
