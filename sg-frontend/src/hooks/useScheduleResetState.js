import { useState, useEffect } from "react";

function useScheduleResetState() {
    const [scheduleReset, setScheduleReset] = useState(false);
    return [scheduleReset, setScheduleReset];
  }

export default useScheduleResetState;