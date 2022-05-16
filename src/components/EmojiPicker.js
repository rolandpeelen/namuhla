import React from "react";
import styled from "styled-components";
import { Button } from "./Button";
import Picker from "emoji-picker-react";
import { useDetectClickOutside } from "react-detect-click-outside";

const Container = styled.div`
  position: relative;
  display: flex;
  background-color: ${({ theme }) => theme.backgroundD1};
`;
const PickerContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100%;
  input.emoji-search {
    margin-top: 1rem;
  }
  nav.emoji-categories {
    display: none;
  }
  ul.emoji-group,
  ul.emoji-group::before {
    border: none;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
  aside.emoji-picker-react {
    border: 2px solid ${({ theme }) => theme.backgroundD2};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: 0px 0px 10px 0px ${({ theme }) => theme.backgroundD2};
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
`;

const EmojiPicker = ({ title, emoji, onEmojiClick }) => {
  const [visible, setVisible] = React.useState(false);
  const ref = useDetectClickOutside({
    onTriggered: () => console.log("triggered") || setVisible(false),
  });

  const toggleVisible = () => setVisible((x) => !x);

  const handleOnEmojiClick = (_e, emoji) => {
    setVisible(false);
    onEmojiClick(`:${emoji.names[1] || emoji.names[0]}:`);
  };

  return (
    <Container ref={ref}>
      <Button transparent onClick={toggleVisible}>
        {title}: "{emoji}"
      </Button>
      {visible && (
        <PickerContainer>
          <Picker disableSkinTonePicker onEmojiClick={handleOnEmojiClick} />
        </PickerContainer>
      )}
    </Container>
  );
};

export default EmojiPicker;
