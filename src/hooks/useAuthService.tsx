// useAuthService.ts
import { useContext } from "react";

import UserContext from "../context/User";
import axios from "axios";

const useAuthService = () => {

  const { user, setUser } = useContext<any>(UserContext);

  const getProfile = async () => {
    const res: any = await axios.get("/auth/profile").catch((err) => ({ data : { success : false}}));
    return res?.data;
  }

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
      setUser({...res, token: user.token })
      return true;
    }

    const authorized = localStorage.getItem("user");
    const data = JSON.parse(authorized || "{}");
    if (!!data?.token) {
      const res = await getProfile();
      if(!res?.id) {
        logout();
        return false;
      }
      setUser({...res, token: data.token})
      return true;      
    }

    logout();
    return false;

  }
  
  return { authenticate };
};

export default useAuthService;
