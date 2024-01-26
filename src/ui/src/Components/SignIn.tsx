import { useState } from "react";

export function SignIn() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  return (
    <div className="text-3xl font-bold underline">
      <div>
        <h3>Username: </h3>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <h3>Display name: </h3>
        <input
          type="text"
          placeholder="Enter display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>

      <button type="submit">Sign In</button>
    </div>
  );
}

export default SignIn;
