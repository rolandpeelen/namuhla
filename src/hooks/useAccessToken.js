import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AUTH_CONFIG } from "../components/Auth/auth0-variables";

function useAccessToken() {
  const [authTokjen, setAuthToken] = useState(null);
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getAccessToken = async () => {
      const { audience, scope } = AUTH_CONFIG;

      try {
        const accessToken = await getAccessTokenSilently({
          audience,
          scope,
        });
        console.log(accessToken);
        setAuthToken(accessToken);
      } catch (e) {
        console.log(e);
        console.log(e.message);
      }
    };

    getAccessToken();
  }, [getAccessTokenSilently, user?.sub]);

  return authTokjen;
}

export default useAccessToken;
