import { useAuth } from "../auth/AuthContext";
import { deleteActivity } from "../api/activities";
import { useState } from "react";

export default function ActivityList({ activities, syncActivities }) {
  return (
    <ul>
      {activities.map((activity) => (
        <ActivityListItem key={activity.id} activity={activity} />
      ))}
    </ul>
  );

  function ActivityListItem({ activity }) {
    const { token } = useAuth();
    const [error, setError] = useState(null);

    async function deleteActivityHandler() {
      setError(null);
      try {
        await deleteActivity(token, activity.id);
        await syncActivities();
      } catch (error) {
        setError(error.message);
      }
    }

    return (
      <li key={activity.id}>
        {activity.name}
        {token && <button onClick={deleteActivityHandler}>Delete</button>}
        {error && <p role="alert">{error}</p>}
      </li>
    );
  }
}
