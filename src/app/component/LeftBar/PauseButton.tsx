import { useGraphHighlight } from '@/app/Graph/GraphControllers';
import { selectCurrentGraph } from '@/app/Redux/graphSlice';
import React from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

interface PauseButtonProps {
    isVisualizing: boolean;
    isPaused: boolean;
    setIsPaused: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export default function PauseButton({ isVisualizing, isPaused, setIsPaused }: PauseButtonProps) {
    const currentGraph = useSelector(selectCurrentGraph);
    const { togglePause } = useGraphHighlight(currentGraph);
    const handlePause = () => {
        if (!isVisualizing) {
            toast.error("No visualization running");
            return;
        }
        togglePause();
        setIsPaused((prev: boolean) => !prev);
        toast.success(isPaused ? "Resumed" : "Paused");
    };
    return (
        <button
            onClick={handlePause}
            className="w-full px-6 py-2.5 mb-3 text-sm font-medium text-white bg-blue-500 rounded-xl
    hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-blue-500 transition-colors duration-200"
        >
            {isPaused ? 'Resume' : 'Pause'}
        </button>
    )
}
