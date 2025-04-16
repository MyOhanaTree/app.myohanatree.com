// useAuthService.ts

import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import UserContext from "context/User";
import { getProfile } from "api/Auth";

const useAuthService = () => {

  const { user, setUser } = useContext<any>(UserContext);
  const authenticatingRef = useRef(false);
  const navigate = useNavigate();

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('authorized');
  };

  const authenticate = async (): Promise<boolean> => {
    if (user?.token) {
      const res = await getProfile();
      if(!res?.id) {
        logout();
        return false;
      }
      setUser(res)
      return true;
    }

    const authorized = localStorage.getItem("user");
    const data = JSON.parse(authorized || "{}");
    if (!!data?.tokens) {
      if (data?.tokens?.expires < Date.now()) {
        logout();
        return false;
      } else {
        const res = await getProfile();
        if(!res?.id) {
          logout();
          return false;
        }
        setUser(res)
        return true;
      }
    }

    logout();
    return false;

  }
  

  return { authenticate };
};

export default useAuthService;
