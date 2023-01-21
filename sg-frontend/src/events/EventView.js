import React, { useContext } from "react";
import UserContext from "../auth/UserContext";
import EventList from "./EventList";
import AddEventForm from "./AddEventForm";

/** Dashboard of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Dashboard
 */

function EventView() {
  const { currentUser } = useContext(UserContext);
  const render = (
    <div className="Dashboard">
    <header className="container h-100 d-flex align-items-center justify-content-around">
          <div className="justify-content-center mt-5 flex-nowrap text-center">
                    <div className="row">
                        <EventList/>
                    </div>

                    <div className='row text-center justify-content-center'>
                        <AddEventForm />
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

export default EventView;