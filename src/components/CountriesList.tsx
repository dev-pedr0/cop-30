import { useState } from "react";
import { useCountries } from "../context/CountriesContext";
import type { CountrySumary } from "../data/contextTypes";

const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function CountriesList() {
  const {
    loading,
    filteredCountries,
    error,
    setSelectedCountry,
  } = useCountries();

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  const regionFiltered =
    selectedRegions.length === 0
      ? filteredCountries
      : filteredCountries.filter((c) =>
          selectedRegions.includes(c.region)
        );

  const countries = regionFiltered.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const handleSelectCountry = (country: CountrySumary) => {
  if (activeCountry === country.iso3) {
    setActiveCountry(null);
    setSelectedCountry(null);
  } else {
    setActiveCountry(country.iso3);
    setSelectedCountry(country.iso3);
  }
};

  const sortedCountries = [...countries].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="countries-list">
      <h2 className="menu-title">Countries</h2>

      <div className="region-filters">
        {REGIONS.map((region) => (
          <button
            key={region}
            onClick={() => toggleRegion(region)}
            className={
              selectedRegions.includes(region)
                ? "region-button active"
                : "region-button"
            }
          >
            {region}
          </button>
        ))}
      </div>

      <input
        className="country-search"
        type="text"
        placeholder="Search by name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {loading && <p className="menu-info">Loading...</p>}
      {error && <p className="menu-error">{error}</p>}

      <div className="countries-items">
        {sortedCountries.map((country) => (
          <div
            key={country.iso3}
            className={
              "country-item " +
              (activeCountry === country.iso3 ? "active" : "")
            }
            onClick={() => handleSelectCountry(country)}
          >
            <img
              src={country.flag ?? ""}
              alt={country.name}
              className="country-flag"
            />
            <span>{country.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
