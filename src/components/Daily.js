import React from "react";
import ReactMarkdown from "react-markdown";
import { ButtonGroup, Button } from "./Button.js";
import { maybeCorrectSourcePosition } from "../utils/markdown.js";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeStringify from "rehype-stringify";
import styled from "styled-components";
import { ThemeContext } from "styled-components";
import remarkGemoji from "remark-gemoji";
import rehypeSanitize from "rehype-sanitize";
import MonacoEditor from "react-monaco-editor";
import { initVimMode } from "monaco-vim";
import { VimMode } from "monaco-vim";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: center;
  & a {
    opacity: 0.5 !important;
    color: ${({ theme }) => theme.text};
  }
`;

const MonacoEditorStyled = styled(MonacoEditor)`
  width: 100% !important;
  height: 100% !important;
  display: flex;
  margin-bottom: 25px;
  line-height: 2;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.background};
`;

const ButtonGroupStyled = styled(ButtonGroup)`
  margin-bottom: 25px !important;
`;

const ListItem = styled.li`
  & input[type="checkbox"] {
    margin-right: 5px;
  }
`;

const replace = {
  true: "[x]",
  false: "[ ]",
};

const Checkbox = ({ sourcePosition, content, onUpdate, checked }) => {
  const handleChange = (e) => {
    const lineNo = sourcePosition.start.line - 1;
    const lines = content.split("\n");

    /* We use the checked value, cast to a string, for the lookup, this will
     * automatically toggle */
    const newLine = lines[lineNo].replace(
      replace[String(checked)],
      replace[String(!checked)]
    );
    lines[lineNo] = newLine;
    const newContent = lines.join("\n");

    onUpdate(newContent);
  };
  return (
    <input
      type="checkbox"
      defaultChecked={checked}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onChange={handleChange}
    />
  );
};

const render = (content, onUpdate, sourcePosition) => (node, i, arr) => {
  if (node.type === "text") return node.value;
  if (node.tagName === "p") {
    return Array.isArray(node.children)
      ? node.children.map(render(content, onUpdate, sourcePosition))
      : [];
  }
  if (node.tagName === "input" && node.properties.type === "checkbox") {
    /* Hacky-hacky-hacky Reason for this hackyness, is that we remove some
     * whitespace, and sometimes the actual sourceposition in the parser get's
     * rekt. The `maybeCorrectSourcePosition` checks wether the line after,
     * or before it matches incase the original doesn't... */
    const reconstructedLine = `- ${replace[node.properties.checked]}${arr
      .map((x) => x.value || "")
      .join("")}`;

    return (
      <Checkbox
        sourcePosition={maybeCorrectSourcePosition(
          reconstructedLine,
          sourcePosition,
          content
        )}
        onUpdate={onUpdate}
        checked={node.properties.checked}
        content={content}
      />
    );
  }

  const children = Array.isArray(node.children)
    ? node.children.map(render(content, onUpdate, sourcePosition))
    : [];

  return React.createElement(node.tagName, node.properties, children);
};

const renderListItem =
  (content, onUpdate) =>
  ({ node, sourcePosition, ordered, ...props }) => {
    return (
      <ListItem>
        {node.children.map(render(content, onUpdate, sourcePosition))}
      </ListItem>
    );
  };

const View = ({ id, content, onUpdate, setEditing }) => {
  const handleKeyDown = (event) => event.keyCode === 13 && setEditing(true);

  React.useEffect(() => {
    window.setTimeout(
      () => document.addEventListener("keyup", handleKeyDown),
      500
    );
    return () => document.removeEventListener("keyup", handleKeyDown);
  }, []);

  return (
    <Container id={id} onClick={(_) => setEditing(true)}>
      <ReactMarkdown
        contentEditable={true}
        rawSourcePos={true}
        components={{ li: renderListItem(content, onUpdate) }}
        children={content}
        remarkPlugins={[remarkBreaks, remarkGfm, remarkGemoji]}
        rehypePlugins={[rehypeStringify, rehypeSanitize]}
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
    setMonaco({ editor, monaco });
  };

  React.useEffect(() => {
    VimMode.Vim.defineEx("wq", "wq", () => onUpdate(monaco.editor.getValue()));
    VimMode.Vim.defineEx("q", "q", () => setEditing(false));
  }, [monaco]);

  return (
    <>
      <MonacoEditorStyled
        id="editor"
        height={500}
        theme={theme.name === "dark" ? "vs-dark" : "vs"}
        language="markdown"
        value={localContent}
        options={{
          minimap: {
            enabled: false,
          },
          lineHeight: 2,
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
          Cancel
        </Button>
        <Button onClick={(event) => onUpdate(localContent)}>Save</Button>
      </ButtonGroupStyled>
    </>
  );
};

export { View, Edit };
