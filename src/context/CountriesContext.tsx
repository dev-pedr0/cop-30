import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { CountrySumary, CountryAuthorities, CountryDetails, Authority } from "../data/contextTypes";
import { FILTERED_COUNTRIES_ISO3 } from "../data/onu";

interface CountriesContextType {
  loading: boolean;
  error: string | null;
  filteredCountries: CountrySumary[];
  authorities: CountryAuthorities;
  selectedCountry: string | null;
  setSelectedCountry: (iso3: string | null) => void;
  searchFiltered: () => Promise<CountrySumary[] | null>;
  searchCountryByCode: (iso3: string) => Promise<CountryDetails | null>;
  regionFilter: (region: string) => CountrySumary[];
  registerAuthority: (
    iso3: string,
    role: string,
    data: any
  ) => void;
  getCountryAuthority: (iso3: string) => Record<string, any>;
  selectedRegions: string[];
  setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
  visibleCountries: CountrySumary[];
}

const CountriesContext = createContext<CountriesContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const CountriesProvider = ({ children }: Props) => {
  const [filteredCountries, setFilteredCountries] = useState<CountrySumary[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const [authorities, setAuthorities] = useState<CountryAuthorities>(() => {
    const cache = localStorage.getItem("authorities");
    return cache ? JSON.parse(cache) : {};
  });

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const searchFiltered = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const isoList = FILTERED_COUNTRIES_ISO3.join(",");

      const response = await fetch(
        `https://restcountries.com/v3.1/alpha?codes=${isoList}`
      );

      if (!response.ok) {
        throw new Error("Error fetching countries");
      }

      const data = await response.json();

      const result: CountrySumary[] = data.map((country: any) => ({
        name: country.name.common,
        flag: country.flags?.png ?? null,
        iso3: country.cca3,
        region: country.region,
      }));

      setFilteredCountries(result);
      localStorage.setItem("filteredCountries", JSON.stringify(result));

      return result;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cache = localStorage.getItem("filteredCountries");

    if (cache) {
      setFilteredCountries(JSON.parse(cache));
      console.log("Loaded from cache");
    } else {
      searchFiltered();
      console.log("Loaded from API");
    }
  }, [searchFiltered]);

  const searchCountryByCode = useCallback(async (iso3: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${iso3}`
      );

      if (!response.ok) {
        throw new Error("Error fetching country");
      }

      const data = await response.json();
      const country = data[0];

      const result: CountryDetails = {
        name: country.name.common,
        flag: country.flags?.png ?? null,
        iso3: country.cca3,
        capital: country.capital?.[0] ?? null,
        region: country.region ?? null,
        language: country.languages
          ? (Object.values(country.languages as Record<string, string>)[0] ?? null)
          : null,
        tld: country.tld?.[0] ?? null,
      };

      return result;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const regionFilter = useCallback(
    (region: string) => {
      if (region === "all") return filteredCountries;
      return filteredCountries.filter(
        (country) => country.region === region
      );
    },
    [filteredCountries]
  );

  const registerAuthority = useCallback(
  (iso3: string, position: string, data: Authority): boolean => {
    let success = true;

    setAuthorities((prev) => {
      const countryAuthorities = prev[iso3] || {};

      if (countryAuthorities[position]) {
        success = false;
        return prev;
      }

      const updated = {
        ...prev,
        [iso3]: {
          ...countryAuthorities,
          [position]: data,
        },
      };

      localStorage.setItem("authorities", JSON.stringify(updated));
      return updated;
    });

    return success;
  },
  []
);

  const getCountryAuthority = useCallback(
    (iso3: string) => {
      return authorities[iso3] || {};
    },
    [authorities]
  );

  const visibleCountries =
  selectedRegions.length === 0
    ? filteredCountries
    : filteredCountries.filter((country) =>
        selectedRegions.includes(country.region)
    );

  return (
    <CountriesContext.Provider
      value={{
        loading,
        error,
        filteredCountries,
        authorities,
        selectedCountry,
        setSelectedCountry,
        searchFiltered,
        searchCountryByCode,
        regionFilter,
        registerAuthority,
        getCountryAuthority,
        selectedRegions,
        setSelectedRegions,
        visibleCountries
      }}
    >
      {children}
    </CountriesContext.Provider>
  );
};

export const useCountries = () => {
  const context = useContext(CountriesContext);
  if (!context) {
    throw new Error("useCountries must be used within a CountriesProvider");
  }
  return context;
};