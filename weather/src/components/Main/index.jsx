import React, { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import Sun from '../img/sunrise.jpg';
import Moon from '../img/moon.jpg';
import Location from '../Location';
import Cloud from '../Conditions/Clouds';
import Snow from '../Conditions/Snow';
import Rain from '../Conditions/Rain';

const Main = ({ setCity, city }) => {
    /////////////////////
    // Initialize States
    /////////////////////

    const [weatherAnimation, setWeatherAnimation] = useState(null);
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
                if (response.data.weather[0].description.includes('rain')) {
                    setWeatherAnimation('Rain');
                } else if (response.data.weather[0].description.includes('snow')) {
                    setWeatherAnimation('Snow');
                } else {
                    setWeatherAnimation('Cloud');
                }
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


    //////////////
    // Render
    //////////////
    return (
        <div className="Main">
            {
                weatherAnimation === 'Cloud' ? (
                    <>
                    <Cloud cloudGroup="clouds-1" cloudClass="cloud-1" count={3} />
                    <Cloud cloudGroup="clouds-2" cloudClass="cloud-2" count={3} />
                    <Cloud cloudGroup="clouds-3" cloudClass="cloud-3" count={3} />
                    </>
                ) : weatherAnimation === 'Snow' ? (
                    <Snow />
                ) : weatherAnimation === 'Rain' ? (
                    <Rain />
                ) : null 
            }
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
                    <div className="background">
                        <img src={isDayTime() ? Sun : Moon} alt="Background" className="bg-image" />
                    </div>
                    
                </div>
            )}
        </div>
    );
};

export default Main;
