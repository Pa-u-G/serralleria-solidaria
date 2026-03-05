import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Bienvenido al panel de control</p>
      <Link className="mr-4 text-blue-600" to="/categories">Categories</Link>
      <br />
      <Link className="text-blue-600" to="/users">Users</Link>
    </div>
  )
}

export default Dashboard