import React from "react";
import { useParams } from "react-router-dom";

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Analysis Details</h1>
      <p>
        Showing analysis details for submission ID: <strong>{id}</strong>
      </p>
    </div>
  );
};

export default Details;
