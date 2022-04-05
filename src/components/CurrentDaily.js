import { useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import DailyWrapper from "./DailyWrapper";

import queries from "../utils/queries.js";
import { getToday, hasDailies, getDailyByDate, head } from "../utils/lib.js";

const CurrentDaily = ({ date, data }) => {
  const client = useApolloClient();
  const creatingDaily = React.useRef(false);
  const currentDaily = React.useMemo(
    () => getDailyByDate(data.dailies, date),
    [date, data]
  );

  const [insertDailyMutation] = useMutation(queries.INSERT_DAILY);

  const insertDaily = (content) =>
    insertDailyMutation({
      variables: {
        content,
      },
      refetchQueries: [queries.GET_DAILIES],
    });

  React.useEffect(() => {
    if (date !== getToday() || !!currentDaily || creatingDaily.current) return;

    console.log("Creating");
    creatingDaily.current = true;

    const dailies = data.dailies;
    const previousDaily = head(dailies);

    client
      .query({
        query: queries.GET_DAILY,
        variables: { id: previousDaily.id },
      })
      .then(({ data }) => {
        if (!hasDailies)
          return "# Welcome \n Here is your first daily! \n Click me to start editing...";

        const daily = head(data.dailies)
          .content.split("\n")
          .filter((x) => !x.includes("[x]"))
          .join("\n");

        if (daily !== "") return daily;

        return "# Welcome Back \n You ticked all the boxes yesterday. Well done :tada:! \n\n Here's a clean slate to start your day :sunglasses:";
      })
      .then(insertDaily)
      .catch((e) => console.log(e));
  }, [client, date, data.dailies, currentDaily, creatingDaily]);

  if (!currentDaily) {
    if (getToday() === date) {
      return "Creating Daily!";
    } else {
      // "Reverse Create Daily?"
      return "Create Daily?";
    }
  }

  return <DailyWrapper id={currentDaily.id} />;
};

export default CurrentDaily;
