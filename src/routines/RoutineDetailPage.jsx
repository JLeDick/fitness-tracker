import { useAuth } from "../auth/AuthContext";
import { useParams, useNavigate, Link } from "react-router";
import { getRoutines, deleteRoutine } from "../api/routines";
import { useEffect, useState } from "react";
import SetForm from "./SetForm";

export default function RoutineDetailPage() {
  const { id } = useParams();
  const [routine, setRoutine] = useState(null);
  const { token } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const syncRoutine = async () => {
    const data = await getRoutines();
    const findRoutine = data.find((routine) => routine.id === Number(id));
    setRoutine(findRoutine);
  };
  // Need to findRoutine because API does not have single Routine endpoint

  async function deleteRoutineHandler() {
    setError(null);
    try {
      await deleteRoutine(token, routine.id);
      navigate("/routines");
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    syncRoutine();
  }, [id]);

  if (!routine) {
    return <h3>Loading...</h3>;
  }

  return (
    <>
      <h1>{routine.name}</h1>
      <h3>{routine.creatorName}</h3>
      <h3>{routine.goal}</h3>
      {token && <button onClick={deleteRoutineHandler}>Delete Routine</button>}
      {error && <p role="alert">{error}</p>}
      <SetForm routine={routine} syncRoutines={syncRoutine} />
    </>
  );
}
