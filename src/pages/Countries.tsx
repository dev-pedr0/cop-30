import { useEffect, useState } from "react";
import { useCountries } from "../context/CountriesContext";
import type { CountryDetails, CountrySumary } from "../data/contextTypes";
import { CountryDetailsCard } from "../components/CountryDetailsCard";
import { CountryCard } from "../components/CountryCard";

const Countries = () => {
  const {
    selectedCountry,
    searchCountryByCode,
    filteredCountries,
    loading,
  } = useCountries();

  const [countryDetails, setCountryDetails] = useState<CountryDetails | null>(null);

  useEffect(() => {
    if (!selectedCountry) {
      setCountryDetails(null);
      return;
    }

    searchCountryByCode(selectedCountry).then(setCountryDetails);
  }, [selectedCountry, searchCountryByCode]);

  if (!selectedCountry) {
    if (loading && filteredCountries.length === 0) {
      return <p>Loading countries...</p>;
    }

    return (
      <div className="countries-grid">
        {filteredCountries.map((country: CountrySumary) => (
          <CountryCard key={country.iso3} country={country} />
        ))}
      </div>
    );
  }

  if (!countryDetails) {
      return <p>Loading country details...</p>;
  }

  return (
    <div className="country-details-wrapper">
      <CountryDetailsCard country={countryDetails} />
    </div>
  );
}

export default Countries