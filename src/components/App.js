import { useQuery, useMutation } from "@apollo/client";
import React from "react";
import CurrentDaily from "./CurrentDaily";
import Header from "./Header";
import Exporter from "./Exporter";
import Toolbar from "./Toolbar";

import queries from "../utils/queries.js";
import { getToday } from "../utils/lib.js";
import { hasSettings, hasDailies } from "../utils/lib.js";
import styled from "styled-components";

const BodyContainer = styled.div`
  min-height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const DailyContainer = styled.div`
  padding-top: 50px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const App = ({ logoutHandler, setTheme }) => {
  const [date, setDate] = React.useState(() => getToday());
  const [exporterActive, setExporterActive] = React.useState(false);
  const dailies = useQuery(queries.GET_DAILIES);
  const settings = useQuery(queries.GET_SETTINGS);
  const [insertDailyMutation] = useMutation(queries.INSERT_DAILY);
  const [insertSettingsMutation] = useMutation(queries.INSERT_SETTINGS);

  React.useEffect(() => {
    if (dailies.data && !hasDailies(dailies.data)) {
      insertDailyMutation({
        variables: {
          content:
            "# Welcome \n Here is your first daily! \n Click me to start editing...",
        },
        refetchQueries: [queries.GET_DAILIES],
      });
    }

    if (settings.data && !hasSettings(settings.data)) {
      insertSettingsMutation({
        refetchQueries: [queries.GET_SETTINGS],
      });
    }
    /* eslint-disable-next-line */
  }, [settings.loading, settings.data, dailies.loading, dailies.data]);

  if (!!dailies.error) {
    console.log(dailies.error);
    return "error";
  }

  if (dailies.loading || settings.loading) {
    return "Loading";
  }

  if (hasDailies(dailies.data) && hasSettings(settings.data)) {
    const settingsObj = settings.data.settings[0]
    return (
      <BodyContainer>
        <Header date={date} logoutHandler={logoutHandler} />
        {/* TODO -> REFACTOR data -> dailies */}
        <DailyContainer>
          <CurrentDaily
            settings={settingsObj}
            date={date} data={dailies.data} />
          <Toolbar
            settings={settingsObj}
            setTheme={setTheme}
            openExport={() => setExporterActive(true)}
            data={dailies.data}
            date={date}
            setDate={setDate}
          />
          {exporterActive && (
            <Exporter
              settings={settingsObj}
              closeExport={() => setExporterActive(false)}
              date={date}
              dailies={dailies.data.dailies}
            />
          )}
        </DailyContainer>
      </BodyContainer>
    );
  }
};

export default App;
