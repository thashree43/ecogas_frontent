import React from 'react';
import {useGetToken} from "./gettoken.ts";

const MyComponent: React.FC = () => {
  const userToken = useGetToken('yourTokenName');

  return (
    <div>
      {userToken ? (
        <p>User is authenticated with details: {JSON.stringify(userToken)}</p>
      ) : (
        <p>No user token found.</p>
      )}
    </div>
  );
};

export default MyComponent;
