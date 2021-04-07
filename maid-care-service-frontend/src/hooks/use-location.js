import { useEffect, useRef, useState } from 'react';

export const useWatchLocation = (options = {}) => {
  const [error, setError] = useState();
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported!');
      return;
    }
  }, []);

  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({
      latitude,
      longitude,
    });
  };

  const handleError = (error) => {
    console.error(error);
    setError(error.message);
  };

  const locationWatchId = useRef(null);

  useEffect(() => {
    locationWatchId.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );
  }, [options]);

  const cancelLocationWatch = () => {
    if (locationWatchId.current && navigator.geolocation) {
      navigator.geolocation.clearWatch(locationWatchId.current);
    }
  };

  useEffect(() => {
    return cancelLocationWatch;
  }, [options]);

  return { location, cancelLocationWatch, error };
};

export const useCurrentLocation = (options) => {
  const [error, setError] = useState();
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported!');
      return;
    }
  }, []);

  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({
      latitude,
      longitude,
    });
  };

  const handleError = (error) => {
    console.error(error);
    setError(error.message);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, [options]);

  return { location, error };
};
