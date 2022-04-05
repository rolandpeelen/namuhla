import { useQuery, useMutation } from "@apollo/client";
import React from "react";
import CurrentDaily from "./CurrentDaily";
import Header from "./Header";
import DatePicker from "./DatePicker";

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

const App = ({ logoutHandler, toggleTheme }) => {
  const [date, setDate] = React.useState(() => getToday());
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
          <Header date={date} toggleTheme={toggleTheme} logoutHandler={logoutHandler} />
        <CurrentDaily date={date} data={data} />
        <DatePicker data={data} date={date} setDate={setDate} />
      </Container>
    );
  }

  return "Loading";
};

export default App;
