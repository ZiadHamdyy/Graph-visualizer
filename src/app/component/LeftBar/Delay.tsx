import React from 'react'
interface DelayProps {
    delay: number;
    setDelay: (value: number) => void;
}

export default function Delay({ delay, setDelay }: DelayProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <label className="text-base font-medium text-gray-800">Delay (ms)</label>
            </div>
            <input
                type="number"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                min="0"
                step="100"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              text-gray-900 text-sm"
            />
        </div>
    )
}
