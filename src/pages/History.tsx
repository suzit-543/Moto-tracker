import { useNavigate } from 'react-router-dom';
import { useEntries } from '../context/EntriesContext';

function History() {
  const { entries, dispatch } = useEntries();
  const navigate=useNavigate()

  return (
    <div className="page">
      <h1>History</h1>
      {entries.length === 0 ? (
        <p className="empty-state">No entries yet.</p>
      ) : (
        <ul className="entry-list">
          {entries.map((entry) => (
            <li key={entry.id} className="entry-card">
              <div className="entry-card__info">
                <span className="entry-card__date">{entry.date}:</span>
                <span className="entry-card__odometer">{entry.odometer} km</span>
                {entry.type === 'fuel' ? (
                  <span className="entry-card__detail">
                    Fuel: {entry.liters}L @ Rs.{entry.costPerLiter}/L (Rs.{entry.cost})
                  </span>
                ) : (
                  <span className="entry-card__detail">
                    Service: {entry.serviceType} (Rs.{entry.cost})
                  </span>
                )}
              </div>
              <div className="entry-card__actions">
                <button
                  className="btn btn--secondary btn--small"
                  onClick={() => navigate(`/edit/${entry.id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn--danger btn--small"
                  onClick={() => dispatch({ type: 'DELETE_ENTRY', payload: { id: entry.id } })}
                >
                  Delete
                </button>
                </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default History;