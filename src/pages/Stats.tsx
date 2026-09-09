import { useEntries } from '../context/EntriesContext';

function Stats() {
  const { entries } = useEntries();

  const fuelEntries = entries.filter((entry) => entry.type === 'fuel').sort((a, b) => a.date.localeCompare(b.date));

  const fuelStats = fuelEntries.map((entry, index) => {
    if (index === 0) {
      return { ...entry, efficiency: null };
    }
    const previousEntry = fuelEntries[index - 1];
    const distance = entry.odometer - previousEntry.odometer;
    const efficiency = distance / entry.liters;

    return { ...entry, efficiency };
  });

 return (
  <div className="page">
    <h1>Stats</h1>

    <section className="stat-section">
      <h2 className="stat-section__title">Fuel Efficiency</h2>
      {fuelStats.length === 0 ? (
        <p className="empty-state">No fuel entries yet.</p>
      ) : (
        <ul className="entry-list">
          {fuelStats.map((entry) => (
            <li key={entry.id} className="entry-card">
              <div className="entry-card__info">
                <span className="entry-card__date">{entry.date}</span>
                <span className="entry-card__odometer">{entry.odometer} km</span>
              </div>
              <span className="efficiency-badge">
                {entry.efficiency !== null
                  ? `${entry.efficiency.toFixed(2)} km/l`
                  : 'N/A'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>
);
}

export default Stats;