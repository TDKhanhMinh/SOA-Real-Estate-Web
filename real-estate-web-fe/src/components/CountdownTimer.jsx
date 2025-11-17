import { useEffect, useState } from "react";

export const CountdownTimer = () => {
    const [minutes, setMinutes] = useState(14);
    const [seconds, setSeconds] = useState(59);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => {
                if (s === 0) {
                    setMinutes(m => {
                        if (m === 0) {
                            clearInterval(interval);
                            return 0;
                        }
                        return m - 1;
                    });
                    return 59;
                }
                return s - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-1 text-3xl font-mono text-gray-800">
                <div className="bg-gray-100 px-3 py-2 rounded-lg shadow-inner">{String(minutes).padStart(2, '0')}</div>
                <span>:</span>
                <div className="bg-gray-100 px-3 py-2 rounded-lg shadow-inner">{String(seconds).padStart(2, '0')}</div>
            </div>
        </div>
    );
};