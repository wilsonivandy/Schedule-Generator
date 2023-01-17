import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import UserContext from './auth/UserContext';
import useLocalStorage from "./hooks/useLocalStorage";
import { BrowserRouter, useHistory } from 'react-router-dom';
import ScheduleGeneratorApi from "./api";
import LoadingSpinner from "./common/LoadingSpinner";
import Routes from './routes/Routes'
import NavBar from './routes/NavBar'
import jwt from "jsonwebtoken";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import useScheduleState from "./hooks/useScheduleState";



import './App.css';

export const TOKEN_LOCAL_STORAGE = "sgToken";

function App() {
  const history = useHistory()
  const [currentUser, setCurrentUser] = useState(null);
  const [groupId, setGroupId] = useState(0);
  const [numSchedules, setNumSchedules] = useState(0);
  const [action, setAction] = useState(null);
  const [editId, setEditId] = useState(0);
  const [token, setToken] = useLocalStorage(TOKEN_LOCAL_STORAGE);
  // const [applicationIds, setApplicationIds] = useState(new Set([]));
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [schedule, setSchedule] = useState(null);

  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          // put the token on the Api class so it can use it to call the API.
          ScheduleGeneratorApi.token = token;
          let currentUser = await ScheduleGeneratorApi.getCurrentUser(username);
          currentUser.username = username;
          setCurrentUser(currentUser);
          // setApplicationIds(new Set(currentUser.applications));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }
    

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);


  async function signUp(signupData) {
    try {
      let token = await ScheduleGeneratorApi.signUp(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  async function login(user) {
    try {
      let token = await ScheduleGeneratorApi.login(user);
      setToken(token);
      return { success: true}
    } catch (errors) {
      return { success: false, errors}
    }
  }

  function logout() {
    setCurrentUser(null);
    setAction(null);
    setToken(null);
    history.push("/dashboard");
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <UserContext.Provider
          value={{ currentUser, setCurrentUser, groupId, setGroupId, editId, setEditId, numSchedules, setNumSchedules, action, setAction}}>
            <NavBar logout={logout} />
            <Routes login={login} signUp={signUp}/>
      </UserContext.Provider>
    </BrowserRouter>

  );
}



export default App;
