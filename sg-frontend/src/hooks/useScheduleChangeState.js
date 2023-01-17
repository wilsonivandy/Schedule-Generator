import { useState, useEffect } from "react";

/** Custom hook for keeping state data synced with localStorage.
 *
 * This creates `item` as state and look in localStorage for current value
 * (if not found, defaults to `firstValue`)
 *
 * When `item` changes, effect re-runs:
 * - if new state is null, removes from localStorage
 * - else, updates localStorage
 *
 * To the component, this just acts like state that is also synced to/from
 * localStorage::
 *
 *   const [myThing, setMyThing] = useLocalStorage("myThing")
 */

function useScheduleChangeState() {
  const [scheduleChange, setScheduleChange] = useState(false);

  function toggleScheduleChange() {
    setScheduleChange(!scheduleChange);
  }
  return [scheduleChange, toggleScheduleChange];
}

export default useScheduleChangeState;
