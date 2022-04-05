import React from "react";

import { useMutation, useQuery } from "@apollo/client";

import * as Daily from "./Daily";
import { hasDailies, head } from "../utils/lib.js";
import queries from "../utils/queries.js";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  overflow: auto;
  width: 60vw;
`;

const DailyWrapper = ({ id }) => {
  const [editing, setEditing] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  const { loading, error, data } = useQuery(queries.GET_DAILY, {
    variables: { id },
  });
  const [updateDailyMutation] = useMutation(queries.UPDATE_DAILY);

  const onUpdate = (content) => {
    setUpdating(true);
    updateDailyMutation({
      variables: {
        id: id,
        content,
        dateUpdated: new Date().toISOString(),
      },
    }).then((content) => {
      setUpdating(false);
      setEditing(false);
    });
  };

  switch (true) {
    case loading:
      return "loading";
    case !!error: {
      console.log(error);
      return "error";
    }
    case hasDailies(data): {
      const daily = head(data.dailies);
      /* Go straight to edit mode if empty */
      daily.content.length === 0 && editing === false && setEditing(true);
      return (
        <Container>
          {updating && "updating"}
          {editing ? (
            <Daily.Edit
              {...daily}
              setEditing={setEditing}
              onUpdate={onUpdate}
            />
          ) : (
            <Daily.View
              {...daily}
              setEditing={setEditing}
              onUpdate={onUpdate}
            />
          )}
        </Container>
      );
    }
    default:
      return "Something horrible happened";
  }
};

export default DailyWrapper;
