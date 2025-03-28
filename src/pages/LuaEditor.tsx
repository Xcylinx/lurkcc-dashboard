
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Editor, { Monaco } from "@monaco-editor/react";
import { Check, Copy, Play, Save } from "lucide-react";
import { editor, languages, Position, IRange, CancellationToken, ITextModel, CompletionContext, CompletionList } from "monaco-editor";

const LuaEditor = () => {
  const [code, setCode] = useState(`-- Lua script example
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

-- Function to print all players in the game
local function printAllPlayers()
    print("Players in game:")
    for _, player in pairs(Players:GetPlayers()) do
        print("- " .. player.Name)
    end
end

-- Function to change the walkspeed of the local player
local function setWalkSpeed(speed)
    if LocalPlayer and LocalPlayer.Character then
        LocalPlayer.Character.Humanoid.WalkSpeed = speed
    end
end

-- Execute commands
printAllPlayers()
setWalkSpeed(50) -- Set walkspeed to 50
print("Script executed successfully!")
`);
  const [copied, setCopied] = useState(false);
  
  const handleEditorDidMount = (monaco: Monaco) => {
    // Register Lua language if not already registered
    if (!monaco.languages.getLanguages().some(lang => lang.id === 'lua')) {
      monaco.languages.register({ id: 'lua' });
      
      // Basic Lua syntax highlighting
      monaco.languages.setMonarchTokensProvider('lua', {
        defaultToken: '',
        tokenPostfix: '.lua',
        keywords: [
          'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function', 'if',
          'in', 'local', 'nil', 'not', 'or', 'repeat', 'return', 'then', 'true', 'until', 'while'
        ],
        brackets: [
          { open: '{', close: '}', token: 'delimiter.curly' },
          { open: '[', close: ']', token: 'delimiter.square' },
          { open: '(', close: ')', token: 'delimiter.parenthesis' }
        ],
        operators: [
          '+', '-', '*', '/', '%', '^', '#', '==', '~=', '<=', '>=', '<', '>', '=',
          ';', ':', ',', '.', '..', '...'
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        tokenizer: {
          root: [
            [/[a-zA-Z_]\w*/, { 
              cases: { 
                '@keywords': 'keyword',
                '@default': 'identifier' 
              } 
            }],
            { include: '@whitespace' },
            [/[{}()\[\]]/, '@brackets'],
            [/@symbols/, {
              cases: {
                '@operators': 'operator',
                '@default': ''
              }
            }],
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/\d+/, 'number'],
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/'([^'\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string."'],
            [/'/, 'string', '@string.\'']
          ],
          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/--\[([=]*)\[/, 'comment', '@comment'],
            [/--.*$/, 'comment']
          ],
          comment: [
            [/[^\]]+/, 'comment'],
            [/\]([=]*)\]/, {
              cases: {
                '$1==$S2': { token: 'comment', next: '@pop' },
                '@default': 'comment'
              }
            }],
            [/./, 'comment']
          ],
          string: [
            [/[^\\"']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/["']/, {
              cases: {
                '$#==$S2': { token: 'string', next: '@pop' },
                '@default': 'string'
              }
            }]
          ]
        }
      });
      
      // Register Lua code completion provider
      monaco.languages.registerCompletionItemProvider('lua', {
        provideCompletionItems: (model: ITextModel, position: Position, context: CompletionContext, token: CancellationToken) => {
          const luaKeywords = [
            { label: 'function', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'function', range: { startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column } },
            { label: 'local', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'local', range: { startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column } },
            { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if ${1:condition} then\n\t${2}\nend', range: { startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column } },
            { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for ${1:i}=${2:1},${3:10} do\n\t${4}\nend', range: { startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column } },
            { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while ${1:condition} do\n\t${2}\nend', range: { startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column } },
            { label: 'print', kind: monaco.languages.CompletionItemKind.Function, insertText: 'print(${1})', range: { startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column } },
            { label: 'return', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'return ${1}', range: { startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column } },
            { label: 'getService', kind: monaco.languages.CompletionItemKind.Method, insertText: 'GetService("${1:Players}")', range: { startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column } }
          ];
          
          return {
            suggestions: luaKeywords
          };
        }
      });
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.lua';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Script saved to file");
  };
  
  const handleExecute = () => {
    // This is just a simulation - in a real world scenario, this would
    // send the code to Roblox for execution
    toast.success("Code executed in Roblox", {
      description: "The script has been sent to the Roblox client",
    });
    console.log("Executing Lua code:", code);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-background/90">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold">Lua Editor</h1>
          <p className="text-muted-foreground">Write and execute Lua scripts directly in your browser</p>
        </motion.div>
        
        <Card className="flex-1 overflow-hidden glass-morphism border-white/5">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="h-full flex-1 min-h-[500px]">
              <Editor
                height="100%"
                defaultLanguage="lua"
                value={code}
                onChange={(value) => setCode(value || "")}
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
            </div>
            
            <div className="p-4 border-t border-white/5 bg-black/30 flex justify-between items-center">
              <div className="space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCopy}
                  className="bg-white/5 hover:bg-white/10 border-white/10"
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleSave}
                  className="bg-white/5 hover:bg-white/10 border-white/10"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
              
              <Button 
                onClick={handleExecute}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Play className="h-4 w-4 mr-1" />
                Execute in Roblox
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LuaEditor;
