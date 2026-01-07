import { useMemo, useState } from "react";
import { useCountries } from "../context/CountriesContext";

const ALLOWED_DATES = ["2026-11-10", "2026-11-21"];

const Agendas = () => {
  const {
    authorities,
    schedules,
    filteredCountries,
    visibleCountries,
    selectedCountry,
    registerSchedule,
    deleteSchedule,
  } = useCountries();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorityId, setAuthorityId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const authoritiesList = useMemo(() => {
    return filteredCountries.flatMap((c) => {
      const auths = authorities[c.iso3] || {};
      return Object.entries(auths).map(([position, info]) => ({
        id: `${c.iso3}-${position}`,
        iso3: c.iso3,
        country: c.name,
        position,
        name: info.nome,
      }));
    });
  }, [authorities, filteredCountries]);

  const visibleSchedules = useMemo(() => {
    const sourceCountries = selectedCountry
      ? filteredCountries.filter((c) => c.iso3 === selectedCountry)
      : visibleCountries;

    return schedules.filter((a) =>
      sourceCountries.some((c) => c.iso3 === a.iso3)
    );
  }, [schedules, filteredCountries, visibleCountries, selectedCountry]);

  const hasConflict = (date: string, time: string) => {
    const newTime = new Date(`${date}T${time}`).getTime();
    return schedules.some((a) => {
      const existing = new Date(`${a.date}T${a.time}`).getTime();
      return Math.abs(newTime - existing) < 15 * 60 * 1000;
    });
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorityId || !date || !time) {
      alert("Fill all fields");
      return;
    }

    if (hasConflict(date, time)) {
      alert("Schedule conflict (15 minutes rule)");
      return;
    }

    const authority = authoritiesList.find((a) => a.id === authorityId);
    if (!authority) return;

    registerSchedule({
      id: Date.now(),
      iso3: authority.iso3,
      country: authority.country,
      authority: authority.name,
      position: authority.position,
      date,
      time,
    });

    setIsModalOpen(false);
    setAuthorityId("");
    setDate("");
    setTime("");
  };
  
  return (
    <div className="schedules-page">
      <div className="schedules-header">
        <h2>Agendas</h2>
        <button onClick={() => setIsModalOpen(true)}>+ Schedule</button>
      </div>

      {visibleSchedules.length === 0 ? (
        <p className="no-schedule">No schedules</p>
      ) : (
        <table className="schedules-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Country</th>
              <th>Authority</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visibleSchedules.map((a) => (
              <tr key={a.id}>
                <td>
                  {a.date.split("-").reverse().join("/")} {a.time}
                </td>
                <td>{a.country}</td>
                <td>
                  {a.authority} – {a.position}
                </td>
                <td>
                  <button
                    className="delete"
                    onClick={() => deleteSchedule(a.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🔹 MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Schedule Presentation</h3>

            <form onSubmit={handleSubmit}>
              <select
                value={authorityId}
                onChange={(e) => setAuthorityId(e.target.value)}
              >
                <option value="">Select authority</option>
                {authoritiesList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.country} / {a.name} / {a.position}
                  </option>
                ))}
              </select>

              <select value={date} onChange={(e) => setDate(e.target.value)}>
                <option value="">Select date</option>
                {ALLOWED_DATES.map((d) => (
                  <option key={d} value={d}>
                    {d.split("-").reverse().join("/")}
                  </option>
                ))}
              </select>

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
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

export default Agendas