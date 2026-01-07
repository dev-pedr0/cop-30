import type { CountrySumary } from "../data/contextTypes";

interface Props {
  country: CountrySumary;
}

export function CountryCard({ country }: Props) {
  return (
    <div className="country-card">
      <img src={country.flag ?? ""} alt={country.name} />
      <h3>{country.name}</h3>
      <p>{country.region}</p>
    </div>
  );
}