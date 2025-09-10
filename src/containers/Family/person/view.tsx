import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Text } from "theme-ui";
import axios from "axios";

import Page from "@/components/ui/Page";
import BasicCard from "@/components/ui/BasicCard";
import moment from "moment-timezone";


export interface Person {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  birthDate: string;
  deathDate: string;
  parents?: Person[];
  relationships?: Person[];
  userId?: string
}

export default function PersonView() {
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(true);  
  const [person, setPerson] = useState<Person | null>(null);

  const loadInit = async () => {
    const { data } = await axios.get(`/family/${id}`).catch((err) => ({ data: err?.response?.data }));    

    if(data?.id){
      setPerson({...data });
    }
    setLoading(false);
  }

  useEffect(() => {    
    document.title = import.meta.env.VITE_REACT_APP_NAME
    loadInit();
  }, []);

  if(loading) return <Page><Spinner /></Page>

  return (
    <Page sx={{gap: "1rem"}}>   
      <BasicCard>
        <Text as="p" sx={{fontWeight: "bold"}}>First Name</Text>
        <Text as="p" sx={{mb: 3}}>{person?.firstName}</Text>                 
        <Text as="p" sx={{fontWeight: "bold"}}>Last Name</Text>
        <Text as="p" sx={{mb: 3}}>{person?.lastName}</Text>                 
        <Text as="p" sx={{fontWeight: "bold"}}>Date of Birth</Text>
        <Text as="p" sx={{mb: 3}}>{person?.birthDate && moment(person?.birthDate).format('LL')}</Text>       
        <Text as="p" sx={{fontWeight: "bold"}}>Date of Passing</Text>        
        <Text as="p" sx={{mb: 3}}>{person?.deathDate && moment(person?.deathDate).format('LL')}</Text>    
        <Text as="p" sx={{fontWeight: "bold"}}>Parents</Text>
        {person?.parents?.map((p, i: number) => (
          <Text key={i} as="p" sx={{mb: i === Number(person?.parents?.length) - 1 ? 3 : 0}}>{p.firstName} {p.lastName}</Text>
        ))}   
        <Text as="p" sx={{fontWeight: "bold"}}>Relationship (spouce, partner, etc.)</Text>
        {person?.relationships?.[0] && (
          <Text as="p">{person?.relationships?.[0]?.firstName} {person?.relationships?.[0]?.lastName}</Text>
        )}
      </BasicCard>      
    </Page>      
  );
}