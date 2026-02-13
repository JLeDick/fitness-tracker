import { useState, useEffect } from "react";
import { createSet } from "../api/routines";
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

    const activityID = formData.get("activityID");
    const count = formData.get("count");
    const routineID = formData.get("routineID");

    try {
      await createSet(token, { activityID, count, routineID });
      syncRoutines();
    } catch (error) {
      console.error(error.message);
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
      <form action="tryCreateSet">
        {routine.sets.length === 0 ? (
          <p>No sets yet! Add one below.</p>
        ) : (
          <ul>
            {routine.sets.map((set) => (
              <li key={set.id}>
                {set.name} x {set.count}
              </li>
            ))}
          </ul>
        )}
      </form>
      <h3>Add a Set</h3>
      <p>Activity</p>
      <select name="activityID">
        {activities.map((activity) => (
          <option key={activity.id} value={activity.id}>
            {activity.name};
          </option>
        ))}
      </select>
      <p>Count</p>
      <input type="number" name="count" />
      {token && <button onClick={tryCreateSet}>Add Set</button>}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
