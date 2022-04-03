import { useQuery } from "@apollo/client";
import React from "react";
import CurrentDaily from "./CurrentDaily";
import DatePicker from "./DatePicker";

import queries from "../utils/queries.js";
import { getToday, hasDailies } from "../utils/lib.js";

const App = () => {
  const [date, setDate] = React.useState(() => getToday());
  const { loading, error, data } = useQuery(queries.GET_DAILIES);

  if (!!error) {
    console.log(error);
    return "error";
  }

  if (!!loading) {
    return "Loading";
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

  return "Something Horrible Happened";
};

export default App;
