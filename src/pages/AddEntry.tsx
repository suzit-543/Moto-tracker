import { useState } from 'react';
import { useEntries, type Entry } from '../context/EntriesContext';
import { useNavigate, useParams } from 'react-router-dom';

function AddEntry() {
  const { entries, dispatch } = useEntries();
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)
  const existingEntry = isEditMode ? entries.find((entry) => entry.id === id) : null;

  const [entryType, setEntryType] = useState<'fuel' | 'service'>(
    existingEntry?.type ?? 'fuel'
  );
  const [date, setDate] = useState(existingEntry?.date ?? '');
  const [odometer, setOdometer] = useState(existingEntry?.odometer.toString() ?? '');
  const [liters, setLiters] = useState(
    existingEntry?.type === 'fuel' ? existingEntry.liters.toString() : ''
  );
  const [costPerLiter, setCostPerLiter] = useState(
    existingEntry?.type === 'fuel' ? existingEntry.costPerLiter.toString() : ''
  );
  const [serviceType, setServiceType] = useState(
    existingEntry?.type === 'service' ? existingEntry.serviceType : ''
  );
  const [serviceCost, setServiceCost] = useState(
    existingEntry?.type === 'service' ? existingEntry.cost.toString() : ''
  );
  const [description, setDescription] = useState(
    existingEntry?.type === 'service' ? existingEntry.description ?? '' : ''
  );
  const [nextServiceDue, setNextServiceDue] = useState(
    existingEntry?.type === 'service' ? existingEntry.nextServiceDue?.toString() ?? '' : ''
  );
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (parseFloat(odometer) < 0) {
      setError('Odometer cannot be negative');
      return;
    }
    const id = isEditMode ? existingEntry!.id : crypto.randomUUID();
    const currentMaxOdometer = Math.max(0, ...entries.filter((entry) => entry.id != id).map((entry) => entry.odometer))
    if (parseFloat(odometer) < currentMaxOdometer) {
      setError('Odometer cannot be less than the last recorded value')
      return
    }

    const today = new Date().toLocaleDateString('en-CA');
    if (date > today) {
      setError('Date cannot be in the future');
      return;
    }

    let newEntry: Entry;
    if (entryType === 'fuel') {
      const litersNum = parseFloat(liters);
      const costPerLiterNum = parseFloat(costPerLiter);

      newEntry = {
        id,
        type: 'fuel',
        date,
        odometer: parseFloat(odometer),
        liters: litersNum,
        costPerLiter: costPerLiterNum,
        cost: litersNum * costPerLiterNum,
      };
    } else {
      newEntry = {
        id,
        type: 'service',
        date,
        odometer: parseFloat(odometer),
        serviceType,
        description: description || undefined,
        cost: parseFloat(serviceCost),
        nextServiceDue: nextServiceDue ? parseFloat(nextServiceDue) : undefined,
      };
    }
    if (isEditMode) {
      dispatch({ type: 'EDIT_ENTRY', payload: newEntry });
    }
    else {
      dispatch({ type: 'ADD_ENTRY', payload: newEntry })
    }
    if (isEditMode) {
      navigate('/history');
    } else {
      resetForm();
    }
  }

  function resetForm() {
    setDate('');
    setOdometer('');
    setLiters('');
    setCostPerLiter('');
    setServiceType('');
    setDescription('');
    setNextServiceDue('');
  }



  return (
    <div className="page">
      <h1>{isEditMode ? 'Edit Entry' : 'Add Entry'}</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="radio-group">
          <label className={`radio-option ${entryType === 'fuel' ? 'radio-option--active' : ''}`}>
            <input
              type="radio"
              name="entryType"
              value="fuel"
              checked={entryType === 'fuel'}
              onChange={() => setEntryType('fuel')}
            />
            Fuel
          </label>
          <label className={`radio-option ${entryType === 'service' ? 'radio-option--active' : ''}`}>
            <input
              type="radio"
              name="entryType"
              value="service"
              checked={entryType === 'service'}
              onChange={() => setEntryType('service')}
            />
            Service
          </label>
        </div>

        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toLocaleDateString('en-CA')}
            required
          />
        </div>

        <div className="field">
          <label>Odometer (km)</label>
          <input
            type="number"
            min="0"
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
            required
          />
        </div>

        {entryType === 'fuel' && (
          <>
            <div className="field">
              <label>Liters</label>
              <input
                type="number"
                step="0.01"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Cost per liter (Rs.)</label>
              <input
                type="number"
                step="0.01"
                value={costPerLiter}
                onChange={(e) => setCostPerLiter(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {entryType === 'service' && (
          <>
            <div className="field">
              <label>Service type</label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Cost (Rs.)</label>
              <input
                type="number"
                step="0.01"
                value={serviceCost}
                onChange={(e) => setServiceCost(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Next service due (odometer, optional)</label>
              <input
                type="number"
                value={nextServiceDue}
                onChange={(e) => setNextServiceDue(e.target.value)}
              />
            </div>
          </>
        )}
        {error && <p className='form-error'>{error}</p>}
        <button type="submit" className="btn btn--primary">
          {isEditMode ? 'Save Changes' : 'Add Entry'}
        </button>
      </form>
    </div>
  )
};

export default AddEntry;