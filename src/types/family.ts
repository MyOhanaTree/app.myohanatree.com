export interface BasicPerson {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  birthDate?: string;
  deathDate?: string;
  gender?: string;
  accountId?: string;
}

export interface FamilyPerson extends BasicPerson {
  parents?: BasicPerson[];
  children?: BasicPerson[];
  siblings?: BasicPerson[];
  relationships?: BasicPerson[]; // e.g. spouse/partner
}
