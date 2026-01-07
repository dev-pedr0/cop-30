import { useMemo, useState } from "react";
import { useCountries } from "../context/CountriesContext";
import type { Authority } from "../data/contextTypes";

const POSITIONS = [
  "Head of State",
  "Minister of Foreign Affairs",
  "Minister of Environment",
];

const Authorities = () => {
  const {
    authorities,
    filteredCountries,
    visibleCountries,
    selectedCountry,
    searchCountryByCode,
    registerAuthority,
    setSelectedCountry,
  } = useCountries();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iso3, setIso3] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  
  const visibleAuthorities = useMemo(() => {
    const sourceCountries = selectedCountry
      ? filteredCountries.filter((c) => c.iso3 === selectedCountry)
      : visibleCountries;

    return sourceCountries.flatMap((country) => {
      const countryAuthorities = authorities[country.iso3] || {};
      return Object.entries(countryAuthorities).map(
        ([position, info]: [string, Authority]) => ({
          iso3: country.iso3,
          country: country.name,
          position,
          ...info,
        })
      );
    });
  }, [authorities, filteredCountries, visibleCountries, selectedCountry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!iso3 || !position) {
      alert("Fill all fields");
      return;
    }

    const countryInfo = await searchCountryByCode(iso3);
    if (!countryInfo?.tld) {
      alert("Unable to validate country TLD");
      return;
    }

    if (!email.toLowerCase().endsWith(countryInfo.tld)) {
      alert(`Email must end with ${countryInfo.tld}`);
      return;
    }

    if (!name.includes(" ")) {
      alert("Please enter full name");
      return;
    }

    registerAuthority(iso3, position, { nome: name, email });
    setSelectedCountry(iso3);

    setIsModalOpen(false);
    setIso3("");
    setName("");
    setPosition("");
    setEmail("");
  };

  return (
    <div className="authorities-page">
      <div className="authorities-header">
        <h2>Authorities</h2>
        <button onClick={() => setIsModalOpen(true)}>+ Register Authority</button>
      </div>

      <div className="authorities-grid">
        {visibleAuthorities.length === 0 ? (
          <p>No authorities registered</p>
        ) : (
          visibleAuthorities.map((a, idx) => (
            <div key={idx} className="authority-card">
              <strong>{a.position}</strong>
              <span>{a.nome}</span>
              <small>{a.email}</small>
              <em>{a.country}</em>
            </div>
          ))
        )}
      </div>

      {/* 🔹 MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Register Authority</h3>

            <form onSubmit={handleSubmit}>
              <select value={iso3} onChange={(e) => setIso3(e.target.value)}>
                <option value="">Select country</option>
                {filteredCountries.map((c) => (
                  <option key={c.iso3} value={c.iso3}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="">Select position</option>
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Authorities