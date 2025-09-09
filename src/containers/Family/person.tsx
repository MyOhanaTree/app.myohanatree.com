import UserContext from "@/context/User";
import { useContext } from "react";
import PersonEdit from "./person/edit";
import PersonView from "./person/view";

export default function Person() {

  const { user } = useContext<any>(UserContext);  

  if(user.permissions.includes("familyEdit")){
    return <PersonEdit />
  }
    
  return <PersonView />

}