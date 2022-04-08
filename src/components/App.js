import { useQuery, useMutation } from "@apollo/client";
import React from "react";
import CurrentDaily from "./CurrentDaily";
import Header from "./Header";
import Exporter from "./Exporter";
import Toolbar from "./Toolbar";

import queries from "../utils/queries.js";
import { getToday } from "../utils/lib.js";
import { hasDailies } from "../utils/lib.js";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const App = ({ logoutHandler, setTheme }) => {
  const [date, setDate] = React.useState(() => getToday());
  const [exporterActive, setExporterActive] = React.useState(false);
  const { loading, error, data } = useQuery(queries.GET_DAILIES);
  const [insertDailyMutation] = useMutation(queries.INSERT_DAILY);

  React.useEffect(() => {
    if (data && !hasDailies(data)) {
      insertDailyMutation({
        variables: {
          content:
            "# Welcome \n Here is your first daily! \n Click me to start editing...",
        },
        refetchQueries: [queries.GET_DAILIES],
      });
    }
  }, [loading, data]);

  if (!!error) {
    console.log(error);
    return "error";
  }

  if (hasDailies(data)) {
    return (
      <Container>
        <Header
          date={date}
          logoutHandler={logoutHandler}
        />
        {/* TODO -> REFACTOR data -> dailies */}
        <CurrentDaily date={date} data={data} />
        <Toolbar
          setTheme={setTheme}
          openExport={() => setExporterActive(true)}
          data={data} date={date} setDate={setDate} />
        {exporterActive && (
          <Exporter
            closeExport={() => setExporterActive(false)}
            date={date}
            dailies={data.dailies}
          />
        )}
      </Container>
    );
  }

  return "Loading";
};

export default App;
