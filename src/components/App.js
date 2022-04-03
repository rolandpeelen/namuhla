import React from "react";

import Header from "./Header";
import Login from "../components/Auth/Login";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

import { useAuth0 } from "@auth0/auth0-react";
import useAccessToken from "../hooks/useAccessToken";

const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new WebSocketLink({
      uri: "wss://nearby-mammal-93.hasura.app/v1/graphql",
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      },
    }),
    cache: new InMemoryCache(),
  });
};

const App = () => {
  const authToken = useAccessToken();
  const { loading, logout } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authToken) {
    return <Login />;
  }
  const client = createApolloClient(authToken);
  return (
    <ApolloProvider client={client}>
      <div>
        <Header logoutHandler={logout} />
        "Hello"
        {console.log(client)}
      </div>
    </ApolloProvider>
  );
};

export default App;
