import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Dashboard</h1>
      <p className="text-gray-700">Bienvenido al panel de control</p>
      <Link to="/categories">Categories</Link>
      <br />
      <Link to="/users">Users</Link>
    </div>
  )
}

export default Dashboard