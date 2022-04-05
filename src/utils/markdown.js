const maybeCorrectSourcePosition = (
  reconstructedLine,
  sourcePosition,
  content
) => {
  const lineNo = sourcePosition.start.line - 1;
  const lines = content.split("\n");

  if (lines[lineNo] === reconstructedLine) return sourcePosition;
  /* With nested list items, we need to look forward to find the new
   * starting position */
  let line = lineNo + 1;
  while (line < lines.length) {
    if (lines[line].includes(reconstructedLine))
      return {
        ...sourcePosition,
        start: {
          ...sourcePosition.start,
          line: line + 1,
        },
      };
    line++;
  }
  return sourcePosition;
};

export { maybeCorrectSourcePosition };
