import React from "react";
import ReactMarkdown from "react-markdown";
import { ButtonGroup, Button } from "./Button.js";
import { useDarkMode } from "../utils/useDarkMode.js";
import { getTheme, defineThemes } from "../utils/theme.js";
import remarkGfm from "remark-gfm";
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

const replace = {
  true: "[x]",
  false: "[ ]",
};

const Checkbox = ({ sourcePosition, content, onUpdate, checked }) => {
  const handleChange = (e) => {
    const lineNo = sourcePosition.start.line - 1;
    const lines = content.split("\n");
    const newLine = lines[sourcePosition.start.line - 1].replace(
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

const Li = styled.li`
  text-decoration: ${({ checked }) => (checked ? "line-through" : "none")};
  & input[type="checkbox"]:disabled {
    display: none;
  }
  & input[type="checkbox"] {
    margin-right: 5px;
  }
`;

const filterCheckboxes = (elements) => {
  if (!Array.isArray(elements)) return elements;
  return elements.map((element) => {
    console.log(element);

    if (!element.props) return element;
    if (element.props.type === "checkbox") return undefined;
    if (element.props.children && element.props.children.length > 0)
      return element.props.children.map(filterCheckboxes);
  });
};

const hasNestedChildren = (children) =>
  Array.isArray(children) &&
  children.some(
    (x) => x.props && x.props.children && x.props.children.length > 0
  );

const renderListItem =
  (content, onUpdate) =>
  ({ node, sourcePosition, ordered, ...props }) => {
    if (props.className === "task-list-item") {
      return (
        <Li checked={props.checked}>
          <Checkbox
            sourcePosition={sourcePosition}
            onUpdate={onUpdate}
            checked={props.checked}
            content={content}
          />
          {props.children}
        </Li>
      );
    }
    return "-";
    //return <li {...props} />;
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
    <Container onClick={(_) => setEditing(true)}>
      <ReactMarkdown
        contentEditable={true}
        rawSourcePos={true}
        components={{ li: renderListItem(content, onUpdate) }}
        children={content}
        remarkPlugins={[remarkGfm, remarkGemoji]}
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
