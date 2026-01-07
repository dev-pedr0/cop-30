import { useCountries } from "../context/CountriesContext";
import type { CountrySumary } from "../data/contextTypes";

interface Props {
  country: CountrySumary;
}

export function CountryCard({ country }: Props) {
  const { setSelectedCountry } = useCountries();

  const handleClick = () => {
    setSelectedCountry(country.iso3);
  };
  
  return (
    <div className="country-card" onClick={handleClick}>
      <img src={country.flag ?? ""} alt={country.name} />
      <h3>{country.name}</h3>
      <p>{country.region}</p>
    </div>
  );
}