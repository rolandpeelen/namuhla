import React from "react";
import ReactMarkdown from "react-markdown";
import { ButtonGroup, Button } from "react-bootstrap";
import { useDarkMode } from "../utils/useDarkMode.js";
import { getTheme, defineThemes } from "../utils/theme.js";
import remarkGfm from "remark-gfm";
import styled from "styled-components";
import { ThemeContext } from "styled-components";
import rehypeSanitize from "rehype-sanitize";
import MonacoEditor from "react-monaco-editor";
import { initVimMode } from "monaco-vim";
import { VimMode } from "monaco-vim";

const Container = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-self: center;
`;

const MonacoEditorStyled = styled(MonacoEditor)`
  width: 100% !important;
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
  const handleKeyDown = (event) => event.keyCode === 13 && setEditing(true);

  React.useEffect(() => {
    window.setTimeout(
      () => document.addEventListener("keyup", handleKeyDown),
      500
    );
    return () => document.removeEventListener("keyup", handleKeyDown);
  }, []);

  return (
    <Container onClick={(_) => setEditing(true)}>
      <ReactMarkdown
        contentEditable={true}
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      />
    </Container>
  );
};

const Edit = ({ id, content, onUpdate, setEditing }) => {
  const [localContent, setLocalContent] = React.useState(content);
  const [monaco, setMonaco] = React.useState(null);
  const theme = React.useContext(ThemeContext);

  const editorDidMount = (editor, monaco) => {
    const vimMode = initVimMode(editor, document.getElementById("status"));
    editor.focus();
    setMonaco([editor, monaco]);
  };

  React.useEffect(() => {
    VimMode.Vim.defineEx("wq", "wq", () => onUpdate(localContent));
    VimMode.Vim.defineEx("q", "q", () => setEditing(false));
  }, []);

  return (
    <Container>
      <MonacoEditorStyled
        height="600"
        id="editor"
        theme={theme.name === "dark" ? "vs-dark" : "vs"}
        language="markdown"
        value={localContent}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 16,
          lineNumbers: "relative",
          wordWrap: "on",
        }}
        onChange={(newValue, e) => setLocalContent(newValue)}
        editorDidMount={editorDidMount}
      />
      <div id="status" />
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
