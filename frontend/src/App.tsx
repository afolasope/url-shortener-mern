import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';
import Signup from './pages/Signup';
import { Login } from './pages/Login';
import Home from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { PrivateRoutes } from './pages/PrivateRoute';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { Analytics } from './pages/Analytics';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Dashboard />} path="/dashboard" />
            <Route element={<Analytics />} path="/analytics/:id" />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route index path="/" element={<Home />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
