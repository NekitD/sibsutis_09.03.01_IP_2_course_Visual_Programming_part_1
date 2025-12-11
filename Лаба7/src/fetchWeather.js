

export default async function fetchWeather(city = "Novosibirsk") {
    if (!city || city.length < 3) return null;
    const apiKey = '4a7c698cb52dd57024c7f5f283643673';
    const respond = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`)
    const result = await respond.json();
    return result;
}

