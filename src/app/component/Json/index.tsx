import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { GraphElement, graphTojson, jsonToGraph } from '@/app/utils/JsonParse';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllElements, setElements } from '@/app/Redux/graphSlice';
import { setJson } from '@/app/Redux/jsonSlice';
import toast from 'react-hot-toast';

const MonacoEditor = dynamic(
    () => import('@monaco-editor/react'),
    { ssr: false }
);
interface JsonType {
    jsonWindow: boolean;
    setJsonWindow: React.Dispatch<React.SetStateAction<boolean>>;
}
const Json = ({ jsonWindow, setJsonWindow }: JsonType) => {
    const [jsonValue, setJsonValue] = useState<string>(JSON.stringify({
        "val": "a",
        "children": [
            {
                "val": "b",
                "children": [
                    {
                        "val": "d",
                        "children": []
                    },
                    {
                        "val": "e",
                        "children": []
                    }
                ]
            },
            {
                "val": "c",
                "children": [
                    {
                        "val": "f",
                        "children": []
                    }
                ]
            }
        ]
    }, null, 2));
    const dispatch = useDispatch();
    const elements = useSelector(selectAllElements);
    useEffect(() => {
        const treesData = graphTojson(elements as GraphElement[]);
        if (!treesData || treesData.length === 0) return;

        const jsonData = treesData.length === 1 ? treesData[0] : treesData;
        const updatedJson = JSON.stringify(jsonData, null, 2);
        setJsonValue(updatedJson);
        dispatch(setJson(updatedJson));
    }, [elements, dispatch]);
    const DrawGraph = () => {
        try {

            const parsedJson = JSON.parse(jsonValue);

            if (!parsedJson || typeof parsedJson !== 'object' || !('val' in parsedJson)) {
                toast.error('Invalid JSON structure.');
                return;
            }

            const graphElements = jsonToGraph(parsedJson);

            dispatch(setJson(JSON.stringify(parsedJson, null, 2)));
            dispatch(setElements(graphElements));
            setJsonWindow(false);

        } catch (error) {
            console.error('Error processing JSON:', error);
            toast.error('Invalid JSON syntax.');
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
            <div className="w-[90%] h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="h-12 bg-gray-100 border-b flex items-center justify-between px-4">
                    <div className="flex items-center gap-4 mt-5">
                        <button
                            onClick={() => setJsonWindow(!jsonWindow)}
                            className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Back
                        </button>
                    </div>
                </div>
                <div className="flex h-[calc(100%-3rem)] gap-4 p-4">
                    <div>


                        <div className="flex-0.5 p-6 overflow-y-auto bg-gray-50  rounded-lg border text-gray-800">
                            <h1 className="text-2xl font-bold mb-6 text-gray-900">JSON Documentation</h1>
                            <p className="mb-4 leading-relaxed">This JSON structure represents each node has:</p>
                            <ul className="mb-4 ml-6 space-y-2">
                                <li><strong className="text-gray-900">val</strong>: A string value representing the node&apos;s content.</li>
                                <li><strong className="text-gray-900">children</strong>: An array containing child nodes and edges.</li>
                            </ul>

                            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-900">Example Explanation:</h2>
                            <p className="mb-4 leading-relaxed">The current structure shows:</p>
                            <ul className="ml-6 space-y-2">
                                <li>Root node &apos;a&apos; has two children: &apos;b&apos; and &apos;c&apos;</li>
                                <li>Node &apos;b&apos; has two children: &apos;d&apos; and &apos;e&apos;</li>
                                <li>Node &apos;c&apos; has one child: &apos;f&apos;</li>
                                <li>Nodes &apos;d&apos;, &apos;e&apos;, and &apos;f&apos; have no children (empty arrays)</li>
                            </ul>
                        </div>
                        <button
                            onClick={DrawGraph}
                            className="w-full px-6 py-2.5  my-4 text-sm font-medium text-white bg-green-500 rounded-xl
            hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-green-500 transition-colors duration-200"
                        >
                            Draw
                        </button>

                    </div>
                    <div className="flex-1 rounded-lg overflow-hidden border bg-gray-50">
                        <MonacoEditor
                            height="100%"
                            defaultLanguage="json"
                            value={jsonValue}
                            onChange={(value) => setJsonValue(value || '')}
                            theme="light"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                theme: 'vs-light',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Json;