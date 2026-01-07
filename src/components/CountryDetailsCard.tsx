import type { CountryDetails } from "../data/contextTypes";

interface Props {
  country: CountryDetails;
}

export function CountryDetailsCard({ country }: Props) {
  return (
    <div className="country-details-card">
      <h2>{country.name}</h2>
      <img src={country.flag ?? ""} alt={country.name} />

      <ul>
        <li>
          <strong>Capital:</strong> {country.capital}
        </li>
        <li>
          <strong>Region:</strong> {country.region}
        </li>
        <li>
          <strong>Language:</strong> {country.language}
        </li>
        <li>
          <strong>Domain:</strong> {country.tld}
        </li>
      </ul>
    </div>
  );
}