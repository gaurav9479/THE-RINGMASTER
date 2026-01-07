import axios from "axios";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export async function geocodeCity(city) {
    const url = `${NOMINATIM_URL}?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const { data } = await axios.get(url, {
        headers: { "User-Agent": "RingmasterApp/1.0" }
    });
    if (!data?.length) {
        throw new Error(`Location not found: ${city}`);
    }
    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
    };
}

export async function getOpenMeteoForecast(lat, lon, startDate, endDate) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,weather_code&timezone=auto`;
    const { data } = await axios.get(url);
    const times = data?.hourly?.time || [];
    const temp = data?.hourly?.temperature_2m || [];
    const rh = data?.hourly?.relative_humidity_2m || [];
    const wcode = data?.hourly?.weather_code || [];
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;
    const forecast = [];
    for (let i = 0; i < times.length; i++) {
        const t = new Date(times[i]);
        if ((s && t < s) || (e && t > e)) continue;
        forecast.push({
            date: times[i],
            temperature: temp[i],
            humidity: rh[i],
            weather: String(wcode[i]),
        });
    }
    return forecast;
}

export async function getOpenMeteoCurrent(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&timezone=auto`;
    const { data } = await axios.get(url);
    const c = data?.current || {};
    return {
        temp: c.temperature_2m,
        humidity: c.relative_humidity_2m,
        weather: String(c.weather_code),
        timestamp: c.time
    };
}

export async function getNwsForecast(lat, lon, startDate, endDate, userAgent) {
    const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;
    const headers = { "User-Agent": userAgent || "RingmasterApp/1.0 (contact@invalid)" };
    const points = await axios.get(pointsUrl, { headers }).then(r => r.data);
    const hourlyUrl = points?.properties?.forecastHourly;
    if (!hourlyUrl) throw new Error("NWS forecast URL not available for these coordinates");
    const hourly = await axios.get(hourlyUrl, { headers }).then(r => r.data);
    const periods = hourly?.properties?.periods || [];
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;
    const forecast = [];
    for (const p of periods) {
        const t = new Date(p.startTime);
        if ((s && t < s) || (e && t > e)) continue;
        // Convert F to C
        const celsius = Math.round(((p.temperature - 32) * 5) / 9);
        forecast.push({
            date: p.startTime,
            temperature: celsius,
            humidity: p.relativeHumidity?.value ?? null,
            weather: p.shortForecast
        });
    }
    return forecast;
}

export async function getNwsCurrent(lat, lon, userAgent) {
    const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;
    const headers = { "User-Agent": userAgent || "RingmasterApp/1.0 (contact@invalid)" };
    const points = await axios.get(pointsUrl, { headers }).then(r => r.data);
    const hourlyUrl = points?.properties?.forecastHourly;
    if (!hourlyUrl) throw new Error("NWS forecast URL not available for these coordinates");
    const hourly = await axios.get(hourlyUrl, { headers }).then(r => r.data);
    const p = (hourly?.properties?.periods || [])[0];
    if (!p) return null;
    const celsius = Math.round(((p.temperature - 32) * 5) / 9);
    return {
        temp: celsius,
        humidity: p.relativeHumidity?.value ?? null,
        weather: p.shortForecast,
        timestamp: p.startTime
    };
}

export async function getOpenWeatherForecastByCity(city, apiKey, startDate, endDate) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const data = await axios.get(apiUrl).then(r => r.data);
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;
    const list = data.list || [];
    const forecast = list
        .filter((entry) => {
            const entryDate = new Date(entry.dt_txt);
            return (!s || entryDate >= s) && (!e || entryDate <= e);
        })
        .map((f) => ({
            date: f.dt_txt,
            temperature: f.main.temp,
            humidity: f.main.humidity,
            weather: f.weather?.[0]?.description || ""
        }));
    return forecast;
}

export async function getOpenWeatherCurrentByCity(city, apiKey) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const data = await axios.get(apiUrl).then(r => r.data);
    return {
        temp: data.main?.temp,
        humidity: data.main?.humidity,
        weather: data.weather?.[0]?.description || "",
        timestamp: new Date().toISOString()
    };
}


