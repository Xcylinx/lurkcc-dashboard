
import { Monaco } from "@monaco-editor/react";

// Function to register Lua language in Monaco editor
export const configureLuaLanguage = (monaco: Monaco) => {
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
      provideCompletionItems: (model, position) => {
        const luaKeywords = [
          { label: 'function', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'function', detail: 'Define a function' },
          { label: 'local', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'local', detail: 'Declare a local variable' },
          { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if ${1:condition} then\n\t${2}\nend', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'If statement' },
          { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for ${1:i}=${2:1},${3:10} do\n\t${4}\nend', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'For loop' },
          { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while ${1:condition} do\n\t${2}\nend', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'While loop' },
          { label: 'print', kind: monaco.languages.CompletionItemKind.Function, insertText: 'print(${1})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Print to console' },
          { label: 'return', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'return ${1}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Return statement' },
          { label: 'GetService', kind: monaco.languages.CompletionItemKind.Method, insertText: 'GetService("${1:Players}")', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Get Roblox service' }
        ];
        
        return {
          suggestions: luaKeywords
        };
      }
    });
  }
};

// Default Lua script example
export const defaultLuaScript = `-- Lua script example
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
`;
