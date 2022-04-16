import { useState, useEffect } from "react";
import { authStates } from "../utils/types.js";
import { useAuth0 } from "@auth0/auth0-react";
import { AUTH_CONFIG } from "../components/Auth/auth0-variables";

function useAccessToken() {
  const [state, setState] = useState([authStates.LOADING, null]);
  const { user, getAccessTokenSilently } = useAuth0();

  const getAccessToken = async () => {
    const { audience, scope } = AUTH_CONFIG;

    try {
      const accessToken = await getAccessTokenSilently({
        audience,
        scope,
      });
      setState([authStates.AUTHORIZED, accessToken]);
    } catch (error) {
      setState([authStates.UNAUTHORIZED, error]);
    }
  };

  useEffect(() => {
    getAccessToken();
    /* eslint-disable-next-line */
  }, [getAccessTokenSilently, user?.sub]);

  return { getAccessToken, state: state[0], data: state[1], setState, user };
}
export { useAccessToken };
