import { useState } from "react";
import { createRoutine } from "../api/routines";
import { useAuth } from "../auth/AuthContext";

export default function RoutineForm({ syncRoutines }) {
  const { token } = useAuth();

  const [error, setError] = useState(null);

  const tryCreateRoutine = async (FormData) => {
    setError(null);

    const name = FormData.get("name");
    const goal = FormData.get("goal");

    try {
      await createRoutine(token, { name, goal });
      syncRoutines();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <h2>Add a new routine</h2>
      <form action={tryCreateRoutine}>
        <label>
          Name
          <input type="text" name="name" />
        </label>
        <label>
          Goal
          <input type="text" name="goal" />
        </label>
        <button>Add Routine</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
