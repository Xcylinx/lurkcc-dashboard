
import React from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { configureLuaLanguage } from "../utils/luaEditorConfig";

interface LuaCodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
}

const LuaCodeEditor: React.FC<LuaCodeEditorProps> = ({ code, onChange }) => {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    configureLuaLanguage(monaco);
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="lua"
      value={code}
      onChange={(value) => onChange(value)}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        autoIndent: "full",
        formatOnPaste: true,
        formatOnType: true,
        tabSize: 2,
      }}
      onMount={handleEditorDidMount}
      className="editor-wrapper"
    />
  );
};

export default LuaCodeEditor;
