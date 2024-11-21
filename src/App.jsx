
import './App.css'
import Dashboard from '../src/pages/Dashboard'
import Grievance from '../src/pages/Grievance'
import AdminLogin from '../src/pages/AdminLogin'
import { Route, Routes } from 'react-router-dom'



function App() {
  

  return (
    <>
    
   <Routes>
   <Route path="/" element={<AdminLogin />} />
     <Route path="/dashboard" element={<Dashboard />} />
     <Route path="/grievance" element={<Grievance />} />
   </Routes>
      
    </>
  )
}

export default App
