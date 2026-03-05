import { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/users")
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Posts desde Laravel</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;