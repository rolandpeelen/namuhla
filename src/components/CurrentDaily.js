import { useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import DailyWrapper from "./DailyWrapper";

import queries from "../utils/queries.js";
import { getToday, hasDailies, getDailyByDate, head } from "../utils/lib.js";

const CurrentDaily = ({ date, data }) => {
  const client = useApolloClient();
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
    if (date !== getToday() || !!currentDaily) return;
    const dailies = data.dailies;
    const previousDaily = head(dailies);

    client
      .query({
        query: queries.GET_DAILY,
        variables: { id: previousDaily.id },
      })
      .then(({ data }) =>
        hasDailies(data)
          ? head(data.dailies)
              .content.split("\n")
              .filter((x) => !x.includes("[x]"))
              .join("\n")
          : "# Welcome \n Here is your first daily! \n Click me to start editing..."
      )
      .then(insertDaily)
      .catch((e) => console.log(e));
  }, [currentDaily, date, data, client]);

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
