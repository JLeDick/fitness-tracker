import { Link } from "react-router";

export default function RoutineList({ routines }) {
  return (
    <ul>
      {routines.map((routine) => (
        <RoutineListItem key={routine.id} routine={routine} />
      ))}
    </ul>
  );

  function RoutineListItem({ routine }) {
    return (
      <li key={routine.id}>
        <Link to={`/routines/${routine.id}`}>{routine.name}</Link>
      </li>
    );
  }
}
