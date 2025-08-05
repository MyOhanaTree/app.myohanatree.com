import React from "react";
import { TreeWrapper, CarouselRow, Card } from "./styled";
import moment from "moment-timezone";
import { Box, Link } from "theme-ui";
import P from "@/components/typography/P";
import H5 from "@/components/typography/H5";

export interface Person {
  id: string;
  fullName: string;
  birthDate: string;
  type?: string,
  parents?: Record<string, Person>;
  siblings?: Record<string, Person>;
  children?: Record<string, Person>;
}

interface FamilyTreeProps {
  person: Person;
  select: (id: string) => void
}

interface PersonCardProps {
  person: Person;
  isMain?: boolean;
  select: (id: string) => void
}

const PersonCard: React.FC<PersonCardProps> = ({ person, isMain, select }) => (
  <Card $isMain={isMain} onClick={() => select(person.id)}>
    <H5>{person.fullName}</H5>
    <P>{moment(person.birthDate).format('LL')}</P>
    <Box sx={{marginTop: "auto"}}><Link href={`/family/${person.id}`}>View</Link></Box>
  </Card>
);

const FamilyTree: React.FC<FamilyTreeProps> = ({ person, select }) => {
  const parents = Object.values(person.parents || {});
  const siblings = [
    ...Object.values(person.siblings || {}),
    person,
  ].sort((a, b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime());
  const children = Object.values(person.children || {});

  const renderRow = (people: Person[], highlightId?: string) => {
    const items = people.map(p => (<PersonCard key={p.id} person={p} isMain={p.id === highlightId} select={select} />))
    const activeIndex = people.findIndex(p => p.id === highlightId)

    let rotated = items;
    if(activeIndex >= 0){
      const index = activeIndex ?? 0;
      const total = items.length;
      const center = Math.floor(total / 2);
      let offset = index - center;
      if (offset < 0) {
        offset = total + offset; // wrap negative offsets
      }
      rotated = [...items.slice(offset), ...items.slice(0, offset)];
    }
        
    return <CarouselRow>{rotated}</CarouselRow>
  };

  return (
    <TreeWrapper>
      {parents.length > 0 ? renderRow(parents) : <CarouselRow></CarouselRow>}
      {renderRow(siblings, person.id)}
      {children.length > 0 ? renderRow(children) : <CarouselRow></CarouselRow>}
    </TreeWrapper>
  );
};

export default FamilyTree;
