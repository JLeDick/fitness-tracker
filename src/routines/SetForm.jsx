import { useState, useEffect } from "react";
import { createSet, deleteSet } from "../api/routines";
import { useAuth } from "../auth/AuthContext";
import { getActivities } from "../api/activities";

export default function SetForm({ syncRoutines, routine }) {
  // Error state for displaying API errors
  const [error, setError] = useState(null);

  // Token auth for API calls
  const { token } = useAuth();

  // Activities for the dropdown - starts empty but gets filled with useEffect
  const [activities, setActivities] = useState([]);

  // Handles form submission for set creation
  const tryCreateSet = async (formData) => {
    setError(null);

    const activityId = formData.get("activityId");
    const count = formData.get("count");

    // I'm sorry what the fuck - How was I supposed to figure out routineID: routine.id on my own?
    try {
      await createSet(token, { activityId, count, routineId: routine.id });
      syncRoutines();
    } catch (error) {
      setError(error.message);
    }
  };

  const tryDeleteSet = async () => {
    setError(null);

    try {
      await deleteSet(token, routine.sets.id);
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch activities on mount to populate the dropdown menu below
  useEffect(() => {
    async function fetchActivities() {
      const data = await getActivities();
      setActivities(data);
    }
    fetchActivities();
  }, []);

  return (
    <>
      <h5>Sets</h5>
      <form action={tryCreateSet}>
        {routine.sets.length === 0 ? (
          <p>No sets yet! Add one below.</p>
        ) : (
          <ul>
            {routine.sets.map((set) => (
              <li key={set.id}>
                {set.name} x {set.count}
                {token && <button onClick={tryDeleteSet}>Delete Set</button>}
              </li>
            ))}
          </ul>
        )}
        <h3>Add a Set</h3>
        <p>Activity</p>
        <select name="activityId">
          {activities.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.name}
            </option>
          ))}
        </select>
        <p>Count</p>
        <input type="number" name="count" />
        {token && <button onClick={tryCreateSet}>Add Set</button>}
        {error && <p role="alert">{error}</p>}
      </form>
    </>
  );
}
