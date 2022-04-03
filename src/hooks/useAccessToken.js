import { useState, useEffect } from "react";
import { authStates } from "../utils/types.js";
import { useAuth0 } from "@auth0/auth0-react";
import { AUTH_CONFIG } from "../components/Auth/auth0-variables";

function useAccessToken() {
  const [state, setState] = useState([authStates.LOADING, null]);
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
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

    getAccessToken();
  }, [getAccessTokenSilently, user?.sub]);

  return state;
}
export { useAccessToken };
