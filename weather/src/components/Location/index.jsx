import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Location = ({ setCity, city }) => {
    const openCageApi = '7bc418295e2d4cdf8465f0ed1975fa38';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // Call the OpenCage reverse geocoding API
                    axios
                    .get(`https://api.opencagedata.com/geocode/v1/json`, {
                        params: {
                            q: `${latitude},${longitude}`,
                            key: openCageApi,
                        },
                    })
                    .then((response) => {
                        if (response.data.results.length > 0) {
                            const address = response.data.results[0];
                            setCity(address.components.city || address.components.town || address.components.village);
                        } else {
                            setError('Could not determine location.');
                        }
                        setLoading(false);
                    })
                    .catch((error) => {
                        setError('Error retrieving location data');
                        setLoading(false);
                    });
                },
                (error) => {
                    setError('Error fetching geolocation');
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
        }, [openCageApi]);

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            {city && (
            <div>
                <p>City: {city}</p>
            </div>
            )}
        </div>
        );
};

export default Location;
