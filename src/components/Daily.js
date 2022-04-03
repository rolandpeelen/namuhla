import React from "react";
import ReactMarkdown from "react-markdown";
import { ButtonGroup, Button } from "react-bootstrap";
import { useDarkMode } from "../utils/useDarkMode.js";
import remarkGfm from "remark-gfm";
import styled from "styled-components";

const Container = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-self: center;
`;

const Textarea = styled.textarea`
  width: 100%;
  display: flex;
  margin-bottom: 25px;
  height: 500px;
  line-height: 2;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.background};
`;

const ButtonGroupStyled = styled(ButtonGroup)`
  margin-bottom: 25px !important;
`;

const View = ({ id, content, setEditing }) => {
  return (
    <Container onClick={(_) => setEditing(true)}>
      <ReactMarkdown
        contentEditable={true}
        children={content}
        remarkPlugins={[remarkGfm]}
      />
    </Container>
  );
};

const Edit = ({ id, content, onUpdate, setEditing }) => {
  const [localContent, setLocalContent] = React.useState(content);
  const [theme] = useDarkMode();
  return (
    <Container>
      <Textarea
        theme={theme}
        defaultValue={localContent}
        onBlur={(event) => setLocalContent(event.target.value)}
      />
      <ButtonGroupStyled>
        <Button variant="secondary" onClick={(event) => setEditing(false)}>
          cancel
        </Button>
        <Button onClick={(event) => onUpdate(localContent)}>Save</Button>
      </ButtonGroupStyled>
    </Container>
  );
};

export { View, Edit };
