import { useEntries } from "../context/EntriesContext";
function Dashboard() {
  const { entries } = useEntries();
  const fuelEntries = entries.filter((entry) => entry.type === 'fuel');
  const serviceEntries = entries.filter((entry) => entry.type === 'service');
  
  const lastFuelEntry = fuelEntries.length > 0
    ? fuelEntries.reduce((latest, entry) =>
        entry.date > latest.date ? entry : latest
      )
    : null;
  
  const lastServiceEntry = serviceEntries.length > 0
    ? serviceEntries.reduce((latest, entry) =>
        entry.date > latest.date ? entry : latest
      )
    : null;

  const currentOdometer = entries.length > 0
  ? Math.max(...entries.map((entry) => entry.odometer))
  : 0;

  const kmUntilService = lastServiceEntry?.nextServiceDue
  ? lastServiceEntry.nextServiceDue - currentOdometer
  : null;

  const serviceDueSoon = kmUntilService !== null && kmUntilService <= 300;
  return (
  <div className="page">
    <h1>Dashboard</h1>
    {serviceDueSoon && (
  <div className="banner banner--warning">
    {kmUntilService! <= 0
      ? `Service overdue by ${Math.abs(kmUntilService!)} km`
      : `Service due in ${kmUntilService} km`}
  </div>
)}

    <section className="stat-section">
      <h2 className="stat-section__title">Last Fill-up</h2>
      {lastFuelEntry ? (
        <div className="stat-card">
          <span className="stat-card__main">{lastFuelEntry.liters}L — Rs.{lastFuelEntry.cost}</span>
          <span className="stat-card__sub">
            {lastFuelEntry.date} at {lastFuelEntry.odometer} km · Rs.{lastFuelEntry.costPerLiter}/L
          </span>
        </div>
      ) : (
        <p className="empty-state">No fuel entries yet.</p>
      )}
    </section>

    <section className="stat-section">
      <h2 className="stat-section__title">Last Service</h2>
      {lastServiceEntry ? (
        <div className="stat-card">
          <span className="stat-card__main">{lastServiceEntry.serviceType} — Rs.{lastServiceEntry.cost}</span>
          <span className="stat-card__sub">
            {lastServiceEntry.date} at {lastServiceEntry.odometer} km
          </span>
        </div>
      ) : (
        <p className="empty-state">No service entries yet.</p>
      )}
    </section>

    <section className="stat-section">
      <h2 className="stat-section__title">Next Service Due</h2>
      {lastServiceEntry?.nextServiceDue ? (
        <div className="stat-card">
          <span className="stat-card__main">{lastServiceEntry.nextServiceDue} km</span>
        </div>
      ) : (
        <p className="empty-state">Not set.</p>
      )}
    </section>
  </div>
);
}
export default Dashboard;