import { useQuery, useMutation } from "@apollo/client";
import React from "react";
import CurrentDaily from "./CurrentDaily";
import DatePicker from "./DatePicker";

import queries from "../utils/queries.js";
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

const App = ({ date, setDate }) => {
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
        <CurrentDaily date={date} data={data} />
        <DatePicker data={data} date={date} setDate={setDate} />
      </Container>
    );
  }

  return "Loading";
};

export default App;
