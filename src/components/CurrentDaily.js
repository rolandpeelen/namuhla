import { useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import DailyWrapper from "./DailyWrapper";
import Loader from "./Loader";

import queries from "../utils/queries.js";
import { getToday, hasDailies, getDailyByDate, head } from "../utils/lib.js";

const CurrentDaily = ({ settings, date, data }) => {
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
          return new Error("Should never ever happen")

        const daily = head(data.dailies)
          .content.split("\n")
          .filter((x) => !x.includes("[x]"))
          .join("\n");

        if (daily !== "") return daily;

        return "# Welcome Back \n You ticked all the boxes yesterday. Well done :tada:! \n\n Here's a clean slate to start your day :sunglasses:";
      })
      .then(insertDaily)
      .catch((e) => console.log(e));
    /* eslint-disable-next-line */
  }, [client, date, data.dailies, currentDaily, creatingDaily]);

  if (!currentDaily) {
    if (getToday() === date) {
      return <Loader message="Creating New Daily..." />;
    } else {
      // "Reverse Create Daily?"
      return "Create Daily?";
    }
  }

  return <DailyWrapper settings={settings} id={currentDaily.id} />;
};

export default CurrentDaily;
