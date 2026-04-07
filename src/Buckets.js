import React, { useState } from "react";
import "./Buckets.css";
export function Buckets(){
const [buckets, setBuckets] = useState([]);

  const createBuckets = () => {
    const newBuckets = Array.from({ length: 5 }, (_, i) => ({
      id: buckets.length + i + 1,
    }));
    setBuckets([...buckets, ...newBuckets]);
  };

  return (
    <div className="app">
      <button onClick={createBuckets}>Create Buckets</button>

      <div className="container">
        {buckets.map((bucket, index) => (
          <Bucket key={bucket.id} index={index} label={`Frame ${bucket.id}`} />
        ))}
      </div>
    </div>
  );
}

function Bucket({ index, label }) {
  return (
    <div className={`bucket ${index % 2 === 0 ? "light" : "dark"}`}>
      <div className="fill" />
      <div className="text">{label}</div>
    </div>
  );
}

// export default Buckets;