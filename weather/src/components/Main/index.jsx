import React, { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import Sun from '../img/sunrise.jpg';
import Moon from '../img/moon.jpg';
import Location from '../Location';

const Main = ({ setCity, city }) => {
    /////////////////////
    // Initialize States
    /////////////////////

    const [currentTime, setCurrentTime] = useState(null);
    const [weather, setWeather] = useState(null);  
    const [loading, setLoading] = useState(false);
    const [inputCity, setInputCity] = useState('');
    const [error, setError] = useState('');

    //////////////
    // API
    //////////////
    const api = '2824b43c294c09a773d66540bbdb9fe5'; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`;
    
    const handleBtnPress = () => {
        setCity(inputCity);
    }


    const convertToTimeInTimezone = (timestamp, timezone) => {
        const date = new Date((timestamp + timezone) * 1000); // Add the timezone offset
        return new Intl.DateTimeFormat('en-US', {
            timeZone: 'UTC',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(date); 
    };


    // Determine whether to show sunrise or sunset image based on time
    const isDayTime = () => {
        if (!weather) return false;

        // Get current time in UTC
        const currentUtc = Date.now(); 
        const sunsetUtc = weather.sys.sunset * 1000; 
        const sunriseUtc = weather.sys.sunrise * 1000; 

        if (currentUtc >= sunriseUtc && currentUtc < sunsetUtc) {
            return true; // Daytime (between sunrise and sunset)
        }
    
        return false; 
    };

    ///////////
    // Effect
    ///////////
    useEffect(() => {
        if (city) {
          setInputCity(city); // Automatically update inputCity to the fetched city
        }
    }, [city]);


    // fetch weather data when city changes
    useEffect(() => {
        if (!city) return;

        setLoading(true);
        setError('');

        axios.get(url)
            .then((response) => {
                setWeather(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Error fetching weather data');
                setLoading(false);
            });
    }, [city, api]);



    // Update current time every second
    useEffect(() => {
        if (!weather) return;

        // Set interval to update current time every second
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        // Clear interval when the component unmounts or weather changes
        return () => clearInterval(interval);
    }, [weather]);
    
    // Create multiple clouds dynamically
    const generateClouds = (num) => {
        const clouds = [];
        for (let i = 0; i < num; i++) {
            clouds.push(
                <div className="cloud" key={i} style={{
                    top: `${Math.random() * 100}%`, // Random vertical position
                    left: `${Math.random() * 100}%`, // Random horizontal position
                    animationDelay: `${Math.random() * 10}s` // Random animation delay
                }}></div>
            );
        }
        return clouds;
    };

    //////////////
    // Render
    //////////////
    return (
        <div className="Main">
            <div className="clouds">
                {generateClouds(10)} {/* Generate 10 clouds */}
            </div>

            {/* <div className="clouds">
                <div className="cloud"></div>
                <div className="cloud"></div>
                <div className="cloud"></div>
            </div> */}
            <Location setCity={setCity} city={city} />
            <div className="city-name">
                <input
                    type="text"
                    value={inputCity}
                    onChange={(e) => setInputCity(e.target.value)}
                    placeholder="Enter city name"
                />
                <button onClick={handleBtnPress}>Get Weather</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}  

            {weather && (
                <div>
                    <h1>{weather.name}</h1>
                    <p>{weather.weather[0].description}</p>
                    <p>Current Time: {convertToTimeInTimezone(Date.now() / 1000, weather.timezone)}</p>
                    <p>Temperature: {weather.main.temp}°C</p>
                    <p>Wind Speed: {weather.wind.speed} m/s</p>

                    {/* Display Pictures based on Day or Night */}
                    {isDayTime() ? (
                        <img src={Sun} alt="Sun is up" />
                    ) : (
                        <img src={Moon} alt="Sun has set" />
                    )}
                    
                </div>
            )}
        </div>
    );
};

export default Main;
