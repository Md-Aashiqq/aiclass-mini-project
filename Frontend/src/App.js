import HomePage from "./Pages/HomePage/HomePage";
import { BrowserRouter } from "react-router-dom";
// import MeetingPage from "./Pages/MeetingPage/MeetingPage";
import AppRouter from "./components/Router/Router";
function App() {
  return (

    <BrowserRouter>
       <div className="App">
     <AppRouter />
    </div>
    </BrowserRouter>

   
  );
}

export default App;
