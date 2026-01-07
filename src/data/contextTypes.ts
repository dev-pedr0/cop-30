export interface CountrySumary {
  name: string;
  flag: string | null;
  iso3: string;
  region: string;
}

export interface CountryDetails extends CountrySumary {
  capital: string | null;
  language: string | null;
  tld: string | null;
}

export type Authority = {
  nome: string;
  political?: string;
  email: string;
};

export type CountryAuthorities = {
  [iso3: string]: {
    [position: string]: Authority;
  };
};

export type Schedule = {
  id: number;
  iso3: string;
  country: string;
  authority: string;
  position: string;
  date: string;
  time: string;
};