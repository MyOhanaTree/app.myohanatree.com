import React from "react";
import { TreeWrapper, CarouselRow, Card } from "./styled";
import moment from "moment-timezone";
import { Link } from "theme-ui";

// ───── Types ─────
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
    <div>{person.fullName}</div>
    <div>{moment(person.birthDate).format('LL')}</div>
    <Link href={`/family/${person.id}`}>View</Link>
  </Card>
);

const FamilyTree: React.FC<FamilyTreeProps> = ({ person, select }) => {
  const parents = Object.values(person.parents || {});
  const siblings = [
    ...Object.values(person.siblings || {}),
    person,
  ].sort((a, b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime());
  const children = Object.values(person.children || {});

  const renderRow = (people: Person[], highlightId?: string) => (
    <CarouselRow>
      {people.map((p) => (
        <PersonCard key={p.id} person={p} isMain={p.id === highlightId} select={select} />
      ))}
    </CarouselRow>
  );

  return (
    <TreeWrapper>
      {parents.length > 0 && renderRow(parents)}
      {renderRow(siblings, person.id)}
      {children.length > 0 && renderRow(children)}
    </TreeWrapper>
  );
};

export default FamilyTree;
