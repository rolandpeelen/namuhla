import { useQuery, useMutation, gql } from "@apollo/client";
import React from "react";
import styled from "styled-components";
import * as Daily from "./Daily";
import { Button } from "./Button";
import * as Array from "../utils/Array.js";
import * as Option from "../utils/Option.js";
import { head, getToday, getDailyByDate } from "../utils/lib.js";
import queries from "../utils/queries.js";

const COMBINED_ID = "combined-boi";
const COPY_EVENT = "copy";
const UPDATE_SETTINGS = gql`
  mutation updateSettings(
    $id: uuid!
    $dateUpdated: timestamptz!
    $todoEmoji: String!
    $notDoneEmoji: String!
    $doneEmoji: String!
  ) {
    update_settings_by_pk(
      pk_columns: { id: $id }
      _set: {
        dateUpdated: $dateUpdated
        todoEmoji: $todoEmoji
        notDoneEmoji: $notDoneEmoji
        doneEmoji: $doneEmoji
      }
    ) {
      id
    }
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;
const ModalCover = styled.div`
  display: block;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`;
const Modal = styled.div`
  max-height: 60vh;
  width: 50vw;
  display: flex;
  align-content: space-between;
  justify-content: space-between;
  flex-direction: column;
  position: fixed;
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.background};
`;

const Body = styled.div`
  padding: 0 2rem 2rem;
  max-height: calc(#{100%} - #{50px} - #{50px});
  overflow-y: scroll;
`;
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const replace = {
  checked: "[x]",
  unchecked: "[ ]",
};

const replaceEmojis = (checkedEmoji, notCheckedEmoji, xs) =>
  xs
    .split("\n")
    .map((x) =>
      x
        .replace(replace.checked, checkedEmoji)
        .replace(replace.unchecked, notCheckedEmoji)
    )
    .join("\n");

const Exporter = ({ settings, date, dailies, closeExport }) => {
  const [updateThemeMutation] = useMutation(UPDATE_SETTINGS);
  const [combined, setCombined] = React.useState("");

  const updateEmoji = (emoji) => {
    updateThemeMutation({
      variables: {
        id: settings.id,
        todoEmoji: settings.todoEmoji,
        notDoneEmoji: settings.notDoneEmoji,
        doneEmoji: settings.doneEmoji,
        ...emoji, // Overwrite only this one
        dateUpdated: new Date().toISOString(),
      },
      refetchQueries: [queries.GET_SETTINGS],
    });
  };

  const current = useQuery(queries.GET_DAILY, {
    variables: { id: getDailyByDate(dailies, date).id },
  });

  const previous = useQuery(queries.GET_PREVIOUS_DAILY, {
    variables: { date },
  });

  const copyToClipboard = () => {
    const copy = (e) => {
      e.preventDefault();
      const copyText = document.getElementById(COMBINED_ID);
      e.clipboardData.setData("text/html", copyText.innerHTML);
      e.clipboardData.setData("text/plain", copyText.innerHTML);
    };
    document.addEventListener(COPY_EVENT, copy);
    document.execCommand(COPY_EVENT);
    document.removeEventListener(COPY_EVENT, copy);
    alert("Paste that boi into slack");
  };

  React.useEffect(() => {
    if (!current.data || !previous.data) return;

    const previousDaily = Array.head(previous.data.dailies);
    const previousReplaced = Option.map((x) =>
      replaceEmojis(settings.doneEmoji, settings.notDoneEmoji, x.content)
    )(previousDaily);
    const previousDailyString = Option.map(
      (x) =>
        `**${Option.getOrElse("")(
          Option.map((daily) => daily.date)(previousDaily)
        )}** \n\n ${x}`
    )(previousReplaced);

    const currentDaily = Array.head(current.data.dailies);
    const currentReplaced = Option.map((x) =>
      replaceEmojis(settings.doneEmoji, settings.todoEmoji, x.content)
    )(currentDaily);
    const currentDailyString = Option.map(
      (x) =>
        `**${
          date === getToday()
            ? "Today"
            : Option.getOrElse("")(
                Option.map((daily) => daily.date)(currentDaily)
              )
        }** \n\n ${x}`
    )(currentReplaced);

    setCombined(
      [
        Option.getOrElse("*-- No previous Daily --*")(previousDailyString),
        "\n\n\n ----------------------- \n",
        Option.getOrElse("No current Daily")(currentDailyString),
      ].join("")
    );
    /* eslint-disable-next-line */
  }, [
    current.data,
    previous.data,
    settings.doneEmoji,
    settings.todoEmoji,
    settings.notDoneEmoji,
  ]);

  return (
    <Container>
      <Modal>
        <Body>
          {current.loading || (previous.loading && "Loading")}
          {current.error && "Error"}
          {previous.error && "Error"}
          {combined && (
            <Daily.View
              id={COMBINED_ID}
              content={combined}
              setEditing={() => false}
              onUpdate={() => false}
            />
          )}
        </Body>
        <Footer>
          <input
            placeholder="Done Emoji"
            disabled={updateThemeMutation.loading}
            defaultValue={settings.doneEmoji}
            onBlur={(e) => updateEmoji({ doneEmoji: e.target.value })}
          />
          <input
            placeholder="Todo Emoji"
            disabled={updateThemeMutation.loading}
            defaultValue={settings.todoEmoji}
            onBlur={(e) => updateEmoji({ todoEmoji: e.target.value })}
          />
          <input
            placeholder="Not Done Emoji"
            disabled={updateThemeMutation.loading}
            defaultValue={settings.notDoneEmoji}
            onBlur={(e) => updateEmoji({ notDoneEmoji: e.target.value })}
          />
          <Button invert onClick={copyToClipboard}>
            Copy
          </Button>
        </Footer>
      </Modal>
      <ModalCover onClick={closeExport} />
    </Container>
  );
};

export default Exporter;
