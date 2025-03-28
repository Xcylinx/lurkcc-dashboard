
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Play, Save, Copy, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import NavigationBar from "@/components/NavigationBar";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

// Default Lua script template
const DEFAULT_SCRIPT = `-- Lurk.cc Lua Script
-- Educational purposes only

local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local Character = LocalPlayer.Character or LocalPlayer.CharacterAdded:Wait()

-- Your code here
print("Hello from Lurk.cc!")
`;

const LuaEditor = () => {
  const { client } = useAuth();
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<null | "success" | "error">(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  
  // Handle Monaco editor mounting
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    editor.focus();
    
    // Add Lua language support
    monaco.languages.register({ id: 'lua' });
    
    // Basic Lua syntax highlighting
    monaco.languages.setMonarchTokensProvider('lua', {
      defaultToken: '',
      tokenPostfix: '.lua',
      
      keywords: [
        'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 
        'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 
        'return', 'then', 'true', 'until', 'while'
      ],
      
      brackets: [
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '[', close: ']', token: 'delimiter.square' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' }
      ],
      
      operators: [
        '+', '-', '*', '/', '%', '^', '#', '==', '~=', '<=', '>=', '<', '>', 
        '=', ';', ':', ',', '.', '..', '...'
      ],
      
      symbols: /[=><!~?:&|+\-*\/\^%]+/,
      
      tokenizer: {
        root: [
          [/--\[\[.*\]\]/m, 'comment'],
          [/--.*$/, 'comment'],
          [/\[\[.*\]\]/m, 'string'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/'([^'\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string_double'],
          [/'/, 'string', '@string_single'],
          [/[a-zA-Z_]\w*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
          [/[ \t\r\n]+/, 'white'],
          [/[{}()\[\]]/, '@brackets'],
          [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
          [/0[xX][0-9a-fA-F]+/, 'number.hex'],
          [/\d+/, 'number'],
        ],
        string_double: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, 'string', '@pop']
        ],
        string_single: [
          [/[^\\']+/, 'string'],
          [/\\./, 'string.escape'],
          [/'/, 'string', '@pop']
        ],
      }
    });
    
    // Basic Lua language completion
    monaco.languages.registerCompletionItemProvider('lua', {
      provideCompletionItems: () => {
        const suggestions = [
          // Roblox services
          { label: 'game:GetService', kind: monaco.languages.CompletionItemKind.Function, insertText: 'game:GetService("$0")' },
          { label: 'Players', kind: monaco.languages.CompletionItemKind.Class, insertText: 'Players' },
          { label: 'Workspace', kind: monaco.languages.CompletionItemKind.Class, insertText: 'Workspace' },
          { label: 'ReplicatedStorage', kind: monaco.languages.CompletionItemKind.Class, insertText: 'ReplicatedStorage' },
          { label: 'RunService', kind: monaco.languages.CompletionItemKind.Class, insertText: 'RunService' },
          
          // Lua keywords
          { label: 'function', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'function ${1:name}(${2:params})\n\t$0\nend' },
          { label: 'local', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'local ' },
          { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if ${1:condition} then\n\t$0\nend' },
          { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for ${1:i}=${2:1},${3:10} do\n\t$0\nend' },
          { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while ${1:condition} do\n\t$0\nend' },
          
          // Common Roblox methods
          { label: 'FindFirstChild', kind: monaco.languages.CompletionItemKind.Method, insertText: 'FindFirstChild("$0")' },
          { label: 'GetChildren', kind: monaco.languages.CompletionItemKind.Method, insertText: 'GetChildren()' },
          { label: 'Connect', kind: monaco.languages.CompletionItemKind.Method, insertText: 'Connect(function($0)\n\t\nend)' },
          { label: 'Destroy', kind: monaco.languages.CompletionItemKind.Method, insertText: 'Destroy()' },
        ];
        return { suggestions };
      }
    });
  };
  
  // Handle editor value change
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setScript(value);
    }
  };
  
  // Handle script execution
  const executeScript = () => {
    setIsExecuting(true);
    setExecutionStatus(null);
    
    // Simulate script execution (this will be replaced with actual implementation)
    setTimeout(() => {
      // In a real implementation, this would send the script to Roblox
      console.log("Executing script:", script);
      
      // Simulate successful execution
      setIsExecuting(false);
      setExecutionStatus("success");
      toast.success("Script executed successfully");
    }, 800);
  };
  
  // Handle script saving
  const saveScript = () => {
    setIsSaving(true);
    
    // Simulate saving to database
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Script saved successfully");
    }, 600);
  };
  
  // Handle script copying to clipboard
  const copyScript = () => {
    navigator.clipboard.writeText(script);
    toast.success("Script copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/80 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/5 backdrop-blur-3xl"
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
              ],
              y: [
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
              ],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
      
      <NavigationBar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto py-8 px-4 md:px-6 flex-1 flex flex-col"
      >
        <div className="space-y-6 flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-transparent bg-clip-text">Lua Script Editor</h1>
              <p className="text-muted-foreground">Create, edit and execute Lua scripts directly into Roblox</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                <Code className="h-3.5 w-3.5 mr-1" />
                Lua Editor
              </Badge>
              {client && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Licensed User
                </Badge>
              )}
            </div>
          </div>
          
          <Card className="border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden relative flex-1 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-blue-500/5 to-teal-500/5 pointer-events-none" />
            
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code size={18} className="text-purple-400" /> 
                    Script Editor
                  </CardTitle>
                  <CardDescription>
                    Write your Lua code below and execute it directly in Roblox
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 flex flex-col min-h-[400px]">
              {/* Monaco editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  defaultLanguage="lua"
                  defaultValue={script}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontFamily: "JetBrains Mono, Consolas, 'Courier New', monospace",
                    fontSize: 14,
                    tabSize: 2,
                    scrollbar: {
                      useShadows: false,
                      verticalHasArrows: true,
                      horizontalHasArrows: true,
                      vertical: 'visible',
                      horizontal: 'visible',
                      verticalScrollbarSize: 12,
                      horizontalScrollbarSize: 12
                    }
                  }}
                  className="editor-wrapper rounded-none"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center border-t border-white/10 p-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={saveScript} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} className="mr-1" /> Save
                    </>
                  )}
                </Button>
                
                <Button variant="outline" size="sm" onClick={copyScript}>
                  <Copy size={14} className="mr-1" /> Copy
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                {executionStatus === "success" && (
                  <div className="flex items-center text-green-500 text-xs">
                    <CheckCircle size={14} className="mr-1" /> Executed successfully
                  </div>
                )}
                
                {executionStatus === "error" && (
                  <div className="flex items-center text-red-500 text-xs">
                    <XCircle size={14} className="mr-1" /> Execution failed
                  </div>
                )}
                
                <Button onClick={executeScript} disabled={isExecuting} className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isExecuting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2"></div>
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play size={14} className="mr-1.5" /> Execute
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card className="border border-white/10 bg-black/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg">How to Use</CardTitle>
              <CardDescription>Follow these steps to execute your Lua scripts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-medium">1. Write Your Script</h3>
                <p className="text-sm text-muted-foreground">Create your Lua script in the editor above</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">2. Execute the Script</h3>
                <p className="text-sm text-muted-foreground">Press the Execute button to run your script in Roblox</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">3. Save for Later Use</h3>
                <p className="text-sm text-muted-foreground">Save your scripts for quick access in future sessions</p>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <p className="text-sm flex items-start">
                  <span className="text-yellow-500 mr-2 mt-0.5">⚠️</span>
                  <span>This feature is for educational purposes only. Please ensure you comply with all applicable terms of service.</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default LuaEditor;
