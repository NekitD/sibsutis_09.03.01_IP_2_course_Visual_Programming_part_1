import React from "react";

export default function WeatherCard(props) {
    const current = props.data.list[0];
    const iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
    const requestDate = new Date(current.dt * 1000).toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
    });

    const nextHoursForecast = props.data.list.slice(0, 5);

    const dailyForecast = props.data.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric" });

        if (!acc[dayKey]) {
            acc[dayKey] = { temps: [], icon: item.weather[0].icon };
        }

        acc[dayKey].temps.push(item.main.temp);
        return acc;
    }, {});

    const fiveDaysForecast = Object.entries(dailyForecast).slice(1).slice(0, 5);

    return (
        <div className="WeatherCard">
            <div className="now-date">{requestDate}</div>
            <div className="now-main">
                <div className="name-temp">
                    <h2>{props.data.city.name}</h2>
                    <h1 className="now-temp">{Math.round(current.main.temp)}°</h1>
                </div>
                <img className="now-icon" src={iconUrl} alt={current.weather[0].description} />
            </div>
            <div className="five-hours-forecast">
                {nextHoursForecast.map((hourData, index) => {
                    const hour = new Date(hourData.dt * 1000).getHours();
                    const hourIcon = `https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`;
                    return (
                        <div key={hourData.dt} className="hour-item">
                            <p>{index === 0 ? "Сейчас" : `${hour}:00`}</p>
                            <img src={hourIcon} alt={hourData.weather[0].description} />
                            <p>{Math.round(hourData.main.temp)}°</p>
                        </div>
                    );
                })}
            </div>
            <div className="details">
                <p>{current.weather[0].description}</p>
                <p>Ветер: {current.wind.speed} м/с</p>
                <p>Влажность: {current.main.humidity}%</p>
                <p>Атмосферное давление: {current.main.pressure} мм</p>
            </div>
            <div className="five-days-forecast">
                {fiveDaysForecast.map(([day, data]) => {
                    const avgTemp = Math.round(data.temps.reduce((a, b) => a + b, 0) / data.temps.length);
                    const dayIconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

                    return (
                        <div key={day} className="day-item">
                            <p className="day">{day}</p>
                            <img src={dayIconUrl} alt="Погода" />
                            <p className="avtemp">{avgTemp}°</p>
                        </div>
                    );
                })
                }
            </div>
        </div>
    );
}