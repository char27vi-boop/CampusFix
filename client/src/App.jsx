import "./App.css";
import Sidebar from "./components/Sidebar";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <StudentDashboard />
    </div>
  );
}

export default App;