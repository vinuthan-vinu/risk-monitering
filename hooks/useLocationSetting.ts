
import { useState } from 'react';

export const useLocationSetting = (): [boolean, () => void] => {
  const [locationEnabled, setLocationEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSetting = localStorage.getItem('locationEnabled');
      // Default to true for a better first-time user experience.
      return savedSetting ? savedSetting === 'true' : true;
    }
    return true;
  });

  const toggleLocationSetting = () => {
    setLocationEnabled(prev => {
      const newSetting = !prev;
      localStorage.setItem('locationEnabled', String(newSetting));
      return newSetting;
    });
  };

  return [locationEnabled, toggleLocationSetting];
};
