// useVersionCheck.js
import React, { useEffect, useState } from 'react';

export const fetchVersion = async () => {
  const response = await fetch('/version.json');
  const data = await response.json();
  return data.version;
};

let CURRENT_VERSION: string;
const useVersionCheck = () => {
  const [hasNewVersion, setHasNewVersion] = useState(false);

  useEffect(() => {
    const checkVersion = async () => {
      const serverVersion = await fetchVersion();
      if(!!!CURRENT_VERSION){
        CURRENT_VERSION = serverVersion;
      }

      if (serverVersion !== CURRENT_VERSION) {
        setHasNewVersion(true);
      }
    };
    checkVersion();

    const intervalId = setInterval(checkVersion, 1800000);    
    return () => clearInterval(intervalId);
  }, []);

  return hasNewVersion;
};

export default useVersionCheck;
