import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";

/** Signup form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls signup function prop
 * - redirects to /companies route
 *
 * Routes -> SignupForm -> Alert
 * Routed as /signup
 */

function SignupForm({ signUp }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  /** Handle form submit:
   *
   * Calls login func prop and, if successful, redirect to /companies.
   */

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await signUp(formData);
    if (result.success) {
      history.push("/dashboard");
    } else {
      setFormErrors(result.errors);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return (

    <div>
      <header className="masthead">
        <div className="LoginForm container-fluid ml-0 mr-0 d-flex h-100 align-items-center justify-content-around">                        <div className="text-light">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Sign Up</h3>
                <form onSubmit={handleSubmit} className="d-flex flex-column">
                <div className="form-group">
                  <label>Username</label>
                  <input
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
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
                  />
                </div>

                <div className="form-group">
                  <label>Name</label>
                  <input
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                  />
                </div>

                {formErrors.length
                    ? <Alert type="danger" messages={formErrors} />
                    : null
                }

                <button
                    type="submit"
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

export default SignupForm;