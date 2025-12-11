import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

const App = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [canceled, setCanceled] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const totalTime = 5000;
    const intervalTime = 100;

    const fetchData = async () => {
        try {
            setLoading(true);
            setCanceled(false);
            setProgress(0);
            setError(null);
            setData(null);

            const startTime = Date.now();
            let interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const newProgress = Math.min((elapsed / totalTime) * 150, 100);
                if (!canceled) {
                    setProgress(newProgress);
                }

                if (newProgress >= 1000) {
                    clearInterval(interval);
                }
            }, intervalTime);

            await new Promise(resolve => setTimeout(resolve, totalTime * 0.7));

            const response = await fetch('https://fakeapi.extendsclass.com/countries');
            if (!response.ok) throw new Error('Failed to fetch data');
            const result = await response.json();

            clearInterval(interval);
            setProgress(100);
            setData(result);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setCanceled(true);
        setLoading(false);
    };

    return (
        <div className="app">
            <h1>Страны:</h1>

            {loading || canceled ? (
                <ProgressBar
                    title="Загрузка данных..."
                    percentage={Math.round(progress)}
                    onCancel={handleCancel}
                    isCanceled={canceled}
                />
            ) : (
                <button onClick={fetchData} disabled={loading}>
                    Загрузить
                </button>
            )}

            {error && <div className="error">Error: {error}</div>}

            {data && !loading && !canceled && (
                <div className="data-container">
                    <h2>Загружено:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default App;