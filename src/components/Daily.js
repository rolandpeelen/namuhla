import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ButtonGroup, Button } from "./Button.js";
import { maybeCorrectSourcePosition } from "../utils/markdown.js";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeStringify from "rehype-stringify";
import styled from "styled-components";
import { ThemeContext } from "styled-components";
import remarkGemoji from "remark-gemoji";
import MonacoEditor from "react-monaco-editor";
import { VimMode, initVimMode } from "monaco-vim";
import { editor, markdown } from "../utils/editor-theme.js";
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'



const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: start;
  padding-top: 50px;
  padding-bottom: 10rem;
  & a {
    opacity: 0.5 !important;
    color: ${({ theme }) => theme.accent};
  }
`;

const MonacoEditorStyled = styled(MonacoEditor)`
  margin-top: 50px;
  width: 100% !important;
  height: 100% !important;
  display: flex;
  margin-bottom: 25px;
  line-height: 2.0;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const ButtonGroupStyled = styled(ButtonGroup)`
  background-color: transparent;
  margin-bottom: 25px !important;
  ${Button} {
      margin: 0 0.25rem;
  }
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
  const handleChange = (_e) => {
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

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)`
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const View = ({ id, content, onUpdate, setEditing }) => {
  const handleKeyDown = (event) => event.keyCode === 13 && setEditing(true);
  const theme = React.useContext(ThemeContext);

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
        components={{
          li: renderListItem(content, onUpdate),
          code({ node, inline, className, sourcePosition, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <StyledSyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={theme.kind === "dark" ? markdown : atomOneLight}
                showLineNumbers={true}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
        children={content}
        remarkPlugins={[remarkBreaks, remarkGfm, remarkGemoji]}
        rehypePlugins={[rehypeStringify]}
      />
    </Container>
  );
};

const Status = styled.div`
  margin: 0.5rem 0;
  span {
    font-family: monospace;
    font-size: 16px;
    color: ${({ theme }) => theme.text};
  }
  /* Status 01, Status 02 */
  & span:nth-of-type(1),
  & span:nth-of-type(5) {
    opacity: 0.5;
  }
  input {
    font-size: 16px;
    padding: 0.25rem;
    font-family: monospace;
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.backgroundL1};
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 2px solid transparent;
    outline: none !important;

    &:focus {
      border-color: ${({ theme }) => theme.backgroundL2};
    }
  }
`;

const Edit = ({ content, onUpdate, setEditing }) => {
  const [localContent, setLocalContent] = React.useState(content);
  const [monaco, setMonaco] = React.useState(null);
  const theme = React.useContext(ThemeContext);

  const editorDidMount = (editor, monaco) => {
    initVimMode(editor, document.getElementById("status"));
    editor.focus();
    setMonaco({ editor, monaco });
  };

  const editorWillMount = (monaco) => {

    monaco.editor.defineTheme("tokyo-night", {
      base: "vs-dark", // can also be vs-dark or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [],
      fontLigatures: true,
      ...editor
    });
  };

  React.useEffect(() => {
    VimMode.Vim.defineEx("wqa", "wqa", () =>
      onUpdate(monaco.editor.getValue())
    );
    VimMode.Vim.defineEx("wq", "wq", () => onUpdate(monaco.editor.getValue()));
    VimMode.Vim.defineEx("qa", "qa", () => setEditing(false));
    VimMode.Vim.defineEx("q", "q", () => setEditing(false));
  }, [monaco]);

  return (
    <>
      <MonacoEditorStyled
        id="editor"
        height={600}
        theme={theme.kind === "dark" ? "tokyo-night" : "vs"}
        language="markdown"
        value={localContent}
        options={{
          minimap: {
            enabled: false,
          },
          lineHeight: 2.2,
          fontSize: 16,
          fontLigatures: true,
          lineNumbers: "relative",
          wordWrap: "on",
        }}
        onChange={(newValue, _e) => setLocalContent(newValue)}
        editorWillMount={editorWillMount}
        editorDidMount={editorDidMount}
      />
      <Status id="status" />
      <ButtonGroupStyled>
        <Button variant="secondary" onClick={(_e) => setEditing(false)}>
          Cancel
        </Button>
        <Button primary onClick={(_e) => onUpdate(localContent)}>Save</Button>
      </ButtonGroupStyled>
    </>
  );
};

export { View, Edit };
