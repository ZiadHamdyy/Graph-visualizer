import { bfs } from '@/app/algorithms/search/bfs';
import { dfs } from '@/app/algorithms/search/dfs';
import { inOrderTraversal } from '@/app/algorithms/traversal/InOrder';
import { postOrderTraversal } from '@/app/algorithms/traversal/PostOrder';
import { preOrderTraversal } from '@/app/algorithms/traversal/PreOrder';
import { useGraphHighlight } from '@/app/Graph/GraphControllers';
import { selectCurrentGraph } from '@/app/Redux/graphSlice';
import { selectJson } from '@/app/Redux/jsonSlice';
import { jsonToHash } from '@/app/utils/hashParse';
import React from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

interface StartButtonProps {
    started: boolean;
    setStarted: (value: boolean) => void;
    selectedAlgo: string;
    startNode: string;
    setIsVisualizing: (value: boolean) => void;
    setIsPaused: (value: boolean) => void;
    searchNode: string;
    delay: number;
}

export default function StartButton({
    started,
    setStarted,
    selectedAlgo,
    startNode,
    setIsVisualizing,
    setIsPaused,
    searchNode,
    delay
}: StartButtonProps) {
    const currentGraph = useSelector(selectCurrentGraph);
    const currentJson = useSelector(selectJson);


    const { iterateAndHighlight, resetElement, elementFound } = useGraphHighlight(currentGraph);
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
            await iterateAndHighlight(Array.isArray(traversalArray) ? traversalArray : traversalArray.result, delay);
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
    return (
        <button
            onClick={handleVisualize}
            className="w-full px-6 py-2.5 mb-3 text-sm font-medium text-white bg-green-500 rounded-xl
            hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-green-500 transition-colors duration-200"
        >
            Start Algorithm
        </button>
    )
}
