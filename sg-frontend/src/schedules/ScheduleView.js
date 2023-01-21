import React, { useContext, useState } from "react";
import UserContext from "../auth/UserContext";
import ScheduleForm from "./ScheduleForm";
import ScheduleList from "./ScheduleList";


/** Dashboard of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Dashboard
 */

function ScheduleView() {
  const { currentUser } = useContext(UserContext);
  const render = (
    <div className="Dashboard">
    <header className="container h-100 d-flex justify-content-center">
          <div className="justify-content-center mt-5 flex-nowrap text-center">
                    <div className="row">
                        <ScheduleList/>
                    </div>

                    <div className='row text-center justify-content-center'>
                        <ScheduleForm />
                    </div>
            </div>
      </header>
    </div>
  )

  return (
      <div>
            {currentUser && render}
      </div>
  );
}

export default ScheduleView;