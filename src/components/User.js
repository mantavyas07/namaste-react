import { useState } from "react";

const User = ({ name }) => {
  const [count, setCount] = useState(0);
  const [count2] = useState(1);

  useEffect(() => {
    // api calls
  }, []);

  return (
    <div className="user-card m-4 p-4 bg-gray-50 rounded-lg shadow-md">
      <h1>Count: {count}</h1>
      <h1>Count2: {count2}</h1>
      <h2>Name: {name}</h2>
      <h3>Location: Bangalore</h3>
      <h4>Contact: @mantavya0701</h4>
      <button onClick={() => setCount(count + 1)}>Count</button>
    </div>
  );
};

export default User;
