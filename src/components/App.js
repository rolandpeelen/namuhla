import { useQuery, useMutation } from "@apollo/client";
import React from "react";
import CurrentDaily from "./CurrentDaily";
import DatePicker from "./DatePicker";

import queries from "../utils/queries.js";
import { getToday, hasDailies } from "../utils/lib.js";

const App = () => {
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
      <>
        <div>
          <h4>{date}</h4>
        </div>
        <CurrentDaily date={date} data={data} />
        <DatePicker data={data} date={date} setDate={setDate} />
      </>
    );
  }

  return "Loading";
};

export default App;
