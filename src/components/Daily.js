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
import Toggle from "./Toggle";
import { VimMode, initVimMode } from "monaco-vim";
import { editor, markdown } from "../utils/editor-theme.js";
import { useMutation, gql } from "@apollo/client";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import queries from "../utils/queries.js";
import { SiVim } from "react-icons/si";
import { RiInputCursorMove } from "react-icons/ri";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: start;
  padding-bottom: 10rem;
  & a {
    transition: all 0.2s ease-out;
    color: ${({ theme }) => theme.accent};
  }
  & a:hover {
    color: ${({ theme }) =>
      theme.kind === "dark" ? theme.accentL1 : theme.accentD1};
  }
`;

const MonacoEditorStyled = styled(MonacoEditor)`
  margin-top: 50px;
  margin-bottom: 25px;
  width: 100% !important;
  height: 100% !important;
  display: flex;
  line-height: 2;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius};
`;
const EditContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Toolbar = styled.div`
  height: 50px;
  width: 66%;
  z-index: 100;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px !important;
  /* For some reason, 77px is the height of the statusbar */
  margin-top: ${({ vimMode }) => (vimMode ? 25 : 77)}px !important;
`;
const ToolbarContent = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: start;
`;

const VimModeLabel = styled.h4`
  font-weight: 500;
  display: inline-flex;
  margin: 0 1rem;
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
  if (node.tagName === "br") return <br key={"br-" + i} />;
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
        key={"checkbox-" + i}
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

  return React.createElement(
    node.tagName,
    { ...node.properties, key: node.tagName + i },
    children
  );
};

const renderListItem =
  (content, onUpdate) =>
  ({ node, sourcePosition }) => {
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
    /* eslint-disable-next-line */
  }, []);

  return (
    <Container id={id} onClick={(_) => setEditing(true)}>
      <ReactMarkdown
        contentEditable={true}
        rawSourcePos={true}
        components={{
          li: renderListItem(content, onUpdate),
          code({
            node,
            inline,
            className,
            sourcePosition,
            children,
            ...props
          }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <StyledSyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
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
            );
          },
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
  width: 80%;
  display: flex;
  align-items: start;
  justify-items: start;
  align-content: start;
  justify-content: start;
  background: ${({ theme }) => theme.background};
  span {
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

const UPDATE_SETTINGS = gql`
  mutation updateSettings(
    $id: uuid!
    $vimMode: Boolean!
    $dateUpdated: timestamptz!
  ) {
    update_settings_by_pk(
      pk_columns: { id: $id }
      _set: { dateUpdated: $dateUpdated, vimMode: $vimMode }
    ) {
      id
    }
  }
`;

const Edit = ({ settings, content, onUpdate, onSave, setEditing }) => {
  const [localContent, setLocalContent] = React.useState(content);
  const [monaco, setMonaco] = React.useState(null);
  const [vimEditor, setVimEditor] = React.useState(null);
  const theme = React.useContext(ThemeContext);
  const [updateSettingsMutation] = useMutation(UPDATE_SETTINGS);

  const editorDidMount = (editor, monaco) => {
    settings.vimMode &&
      setVimEditor(initVimMode(editor, document.getElementById("status")));
    editor.focus();
    setMonaco({ editor, monaco });
  };

  const handleSetVimMode = (e) => {
    updateSettingsMutation({
      variables: {
        id: settings.id,
        vimMode: e.target.checked,
        dateUpdated: new Date().toISOString(),
      },
      refetchQueries: [queries.GET_SETTINGS],
    });
    if (e.target.checked) {
      setVimEditor(
        initVimMode(monaco.editor, document.getElementById("status"))
      );
    } else {
      vimEditor.dispose();
      setVimEditor(null);
    }
  };

  const editorWillMount = (monaco) => {
    monaco.editor.defineTheme("tokyo-night", {
      base: "vs-dark", // can also be vs-dark or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [],
      fontLigatures: true,
      ...editor,
    });
  };

  React.useEffect(() => {
    VimMode.Vim.defineEx("wqa", "wqa", () =>
      onUpdate(monaco.editor.getValue())
    );
    VimMode.Vim.defineEx("wq", "wq", () => onUpdate(monaco.editor.getValue()));
    VimMode.Vim.defineEx("qa", "qa", () => setEditing(false));
    VimMode.Vim.defineEx("q", "q", () => setEditing(false));
    VimMode.Vim.defineEx("w", "w", () => onSave(monaco.editor.getValue()));
    /* eslint-disable-next-line */
  }, [monaco]);

  return (
    <EditContainer>
      <MonacoEditorStyled
        id="editor"
        disabled={true}
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
          fontFamily: "Fira Code",
          lineNumbers: "relative",
          wordWrap: "on",
        }}
        onChange={(newValue, _e) => setLocalContent(newValue)}
        editorWillMount={editorWillMount}
        editorDidMount={editorDidMount}
      />
      <Status id="status" />
      <Toolbar vimMode={!!vimEditor}>
        <ToolbarContent>
          <Toggle
            id="vim-mode-status"
            disabled={!monaco}
            icons={{
              checked: <SiVim size={14} />,
              unchecked: <RiInputCursorMove size={14} />,
            }}
            defaultChecked={settings.vimMode}
            onChange={handleSetVimMode}
          />
          <VimModeLabel id="vim-mode-label">Vim Bindings</VimModeLabel>
        </ToolbarContent>
        <ButtonGroup>
          <Button variant="secondary" onClick={(_e) => setEditing(false)}>
            Cancel
          </Button>
          <Button primary onClick={(_e) => onUpdate(localContent)}>
            Save
          </Button>
        </ButtonGroup>
      </Toolbar>
    </EditContainer>
  );
};

export { View, Edit };
