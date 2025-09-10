import React from "react";
import moment from "moment-timezone";
import styled from "styled-components";
import { Box, Divider, Flex, Grid, Heading, Link, Text } from "theme-ui";

export const Card = styled(Box)<{ $isMain?: boolean }>`
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;  
  justify-content: center;
  padding: 1rem;
  border: 2px solid ${({ $isMain }) => ($isMain ? "#0077ff" : "#ddd")};
  border-radius: 10px;
  background-color: ${({ $isMain }) => ($isMain ? "#e6f3ff" : "#fff")};
  text-align: center;
  scroll-snap-align: start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #e6f3ff;
    border-color: #0077ff;
  }
`;

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  type?: string,
  parents?: Person[];
  siblings?: Person[];
  children?: Person[];
  relationships?: Person[];
}

interface FamilyTreeProps {
  person: Person;
  select: (id: string) => void
}

interface PersonCardProps {
  person?: Person | null;
  isMain?: boolean;
  select: (id: string) => void
}

const PersonCard: React.FC<PersonCardProps> = ({ person, isMain, select }) => {
  if(!person) return <div></div>;

  const relationship = person?.relationships?.[0];

  return (
    <Box sx={{ display: "flex",flexDirection: "column", alignItems: "center", gap: "5px"}}>
      <Card $isMain={isMain} onClick={() => select(person.id)}>
        {!isMain && (
          <Box sx={{ display: ["flex","none"], alignItems: "center", justifyContent: "center", fontWeight: "bold", background: "secondary", color: "white", width: "50px", height:"50px", borderRadius: "50px"}}>
            {person.firstName.slice(0, 2)}
          </Box>
        )}
        <Box sx={{ display: [!isMain ? "none" : "block","block"]}}>
          <Heading as="h3">{person.firstName} {person.lastName}</Heading>              
          <Text>{moment(person.birthDate).format('LL')}</Text>
          <Box sx={{marginTop: "auto"}}><Link href={`/family/${person.id}`}>View</Link></Box>
        </Box>
      </Card>
      {relationship && (
        <Card onClick={() => select(relationship.id)}>          
          <Box sx={{ display: ["flex","none"], alignItems: "center", justifyContent: "center", fontWeight: "bold", background: "secondary", color: "white", width: "50px", height:"50px", borderRadius: "50px"}}>
            {relationship.firstName.slice(0, 2)}
          </Box>          
          <Box sx={{ display: ["none","block"]}}>
            <Heading as="h3">{relationship.firstName} {relationship.lastName}</Heading>              
            <Text>{moment(relationship.birthDate).format('LL')}</Text>
            <Box sx={{marginTop: "auto"}}><Link href={`/family/${relationship.id}`}>View</Link></Box>
          </Box>
        </Card>
      )}
    </Box>
  );
};

const FamilyTree: React.FC<FamilyTreeProps> = ({ person, select }) => {
  const parents = Object.values(person.parents || {});
  const siblings = [
    ...Object.values(person.siblings || {}),
    person,
  ].sort((a, b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime());
  const children = Object.values(person.children || {});

  const renderRow = (people: Person[], highlightId?: string) => {
    return (
      <Flex sx={{flexWrap: "wrap", justifyContent:"center", gap: "15px"}}>
        {people.filter(Boolean).map(p => (<PersonCard key={p?.id} person={p} isMain={p?.id === highlightId} select={select} />))}
      </Flex>
    );
  };

  return (
    <Grid sx={{justifyContent:"center", alignItems: "center", margin: "auto", gap: "25px", padding: ["10px","2rem"]}}>
      {parents.length > 0 && renderRow(parents)}
      <Divider />
      {renderRow(siblings, person.id)}
      <Divider />
      {children.length > 0 && renderRow(children)}
    </Grid>
  );
};

export default FamilyTree;
