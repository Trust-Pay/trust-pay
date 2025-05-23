"use client"

import * as React from "react"

const News = () => {
    const [news, setNews] = React.useState([]);
    const hasFetched = React.useRef(false);

    React.useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetch('/api/news')
            .then((res) => res.json())
            .catch((error) => console.error('Error fetching news:', error));
    }, []);

    return (
        <div className="w-full px-4 py-8 max-w-7xl mx-auto space-y-6">
            <h1 className="text-xl font-semibold">Latest News</h1>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(news ?? []).map((item, index) => (
                    <div
                        key={index}
                        className="p-4 rounded-lg bg-yellow-100/30 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                    >
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">
                            {item.type}
                        </div>
                        <div className="text-base font-bold">
                            {item.title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            {item.date}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}
export { News }