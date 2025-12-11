import React, { useState, useEffect } from "react";
import fetchWeather from "./fetchWeather";
import Searcher from "./Searcher";
import WeatherCard from "./WeatherCard";
import "./index.css";

export default function Application() {

    const [searchQuery, setSearchQuery] = useState("Новосибирск");
    const [weatherData, setWeatherData] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState("#87CEEB");


    useEffect(() => {
        if (!searchQuery.trim()) return;

        const timeoutId = setTimeout(async () => {
            const data = await fetchWeather(searchQuery);
            if (data && data.cod !== "404") {
                setWeatherData(data);
                updateBackgroundColor(data);
            }
        }, 200);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    function updateBackgroundColor(data) {
        const currentWeather = data.list[0].weather[0].main.toLowerCase();
        const hour = new Date().getHours();

        const getTimeOfDay = (hour) => {
            if (hour >= 6 && hour < 12) return "morning";
            if (hour >= 12 && hour < 18) return "day";
            if (hour >= 18 && hour < 22) return "evening";
            return "night";
        };

        const timeOfDay = getTimeOfDay(hour);

        const colors = {
            clear: {
                morning: "#FFDD87",
                day: "#87CEEB",
                evening: "#FF7F50",
                night: "#2C3E50",
            },
            clouds: {
                morning: "#C0C0C0",
                day: "#A0A0A0",
                evening: "#808080",
                night: "#4B4B4B",
            },
            rain: {
                morning: "#A0A0A0",
                day: "#708090",
                evening: "#606060",
                night: "#2F4F4F",
            },
            snow: {
                morning: "#E0E0E0",
                day: "#D0D0D0",
                evening: "#C0C0C0",
                night: "#A0A0A0",
            },
            default: "#87CEEB",
        };
        setBackgroundColor(colors[currentWeather]?.[timeOfDay] || colors.default);
    }

    return (
        <div className="App" style={{ backgroundColor }}>
            <div className="search">
                <Searcher
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </div>
            <div>
                {weatherData && <WeatherCard data={weatherData} />}
            </div>
        </div>
    );

}