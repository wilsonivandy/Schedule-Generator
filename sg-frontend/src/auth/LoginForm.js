import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";
import "./LoginForm.css";

/** Login form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls login function prop
 * - redirects to /companies route
 *
 * Routes -> LoginForm -> Alert
 * Routed as /login
 */

function LoginForm({ login }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  /** Handle form submit:
   *
   * Calls login func prop and, if successful, redirect to /companies.
   */

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await login(formData);
    if (result.success) {
      history.push("/dashboard");
    } else {
      setFormErrors(result.errors);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  return (
    <div>
      <header className="masthead">
        <div className="LoginForm container-fluid ml-0 mr-0 d-flex h-100 align-items-center justify-content-around">                        <div className="text-light">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Log In</h3>
                <form onSubmit={handleSubmit} className="d-flex flex-column">
                  <div className="form-group">
                      <label>Username</label>
                      <input
                          name="username"
                          className="form-control"
                          value={formData.username}
                          onChange={handleChange}
                          autoComplete="username"
                          required
                              />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                                  required
                    />
                  </div>
                  {formErrors.length
                      ? <Alert type="danger" messages={formErrors} />
                      : null}
                  <button
                      className="btn btn-primary mt-2"
                      onSubmit={handleSubmit}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>
  </div>
   
      
  );
}

export default LoginForm;
