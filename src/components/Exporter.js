import { useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";
import * as Daily from "./Daily";
import { Button } from "./Button";
import { hasDailies, head, getDailyByDate } from "../utils/lib.js";
import queries from "../utils/queries.js";

const COMBINED_ID = "combined-boi";
const COPY_EVENT = "copy-boi";

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

const replaceEmojis = (doneEmoji, notDoneEmoji) => (xs) =>
  xs
    .split("\n")
    .map((x) =>
      x
        .replace(replace.checked, doneEmoji)
        .replace(replace.unchecked, notDoneEmoji)
    )
    .join("\n");

const Exporter = ({ date, dailies, toggleExport }) => {
  const [doneEmoji, setDoneEmoji] = React.useState(":white_check_mark: -");
  const [notDoneEmoji, setNotDoneEmoji] = React.useState(":x: -");
  const [combined, setCombined] = React.useState("");

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

    const replaceEmojisP = replaceEmojis(doneEmoji, notDoneEmoji);
    const previousDaily = head(previous.data.dailies);
    const previousReplaced = replaceEmojisP(previousDaily.content);

    const currentDaily = head(current.data.dailies);
    const currentReplaced = replaceEmojisP(currentDaily.content);

    setCombined(
      `**${previousDaily.date}** \n ${previousReplaced} \n\n **${currentDaily.date}** \n ${currentReplaced}`
    );
  }, [current.data, previous.data, doneEmoji, notDoneEmoji]);

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
            defaultValue={doneEmoji}
            onBlur={(e) => setDoneEmoji(e.target.value)}
          />
          <input
            defaultValue={notDoneEmoji}
            onBlur={(e) => setNotDoneEmoji(e.target.value)}
          />
          <Button invert onClick={copyToClipboard}>
            Copy
          </Button>
        </Footer>
      </Modal>
      <ModalCover onClick={toggleExport} />
    </Container>
  );
};

export default Exporter;
