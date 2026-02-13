import { useAuth } from "../auth/AuthContext";
import { useParams, useNavigate } from "react-router";
import { getActivity, deleteActivity } from "../api/activities";
import { useEffect, useState } from "react";

export default function ActivityDetailsPage() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const { token } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const syncActivity = async () => {
    const data = await getActivity(id);
    setActivity(data);
  };

  async function deleteActivityHandler() {
    setError(null);
    try {
      await deleteActivity(token, activity.id);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    syncActivity();
  }, [id]);

  if (!activity) {
    return <h3>Loading...</h3>;
  }

  return (
    <>
      <h1>{activity.name}</h1>
      <h3>{activity.creatorName}</h3>
      <h3>{activity.description}</h3>
      {token && (
        <button onClick={deleteActivityHandler}>Delete Activity</button>
      )}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
