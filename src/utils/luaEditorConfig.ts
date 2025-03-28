
import { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

// Function to register Lua language in Monaco editor
export const configureLuaLanguage = (monaco: Monaco) => {
  // Register Lua language if not already registered
  if (!monaco.languages.getLanguages().some(lang => lang.id === 'lua')) {
    monaco.languages.register({ id: 'lua' });
    
    // Basic Lua syntax highlighting with Roblox additions
    monaco.languages.setMonarchTokensProvider('lua', {
      defaultToken: '',
      tokenPostfix: '.lua',
      keywords: [
        'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function', 'if',
        'in', 'local', 'nil', 'not', 'or', 'repeat', 'return', 'then', 'true', 'until', 'while'
      ],
      
      // Roblox-specific globals
      robloxGlobals: [
        'game', 'workspace', 'script', 'math', 'string', 'table', 'Enum', 'Instance', 'Vector3', 'CFrame',
        'Color3', 'BrickColor', 'Ray', 'Region3', 'TweenInfo', 'UDim2', 'task', 'wait', 'delay',
        'spawn', 'tick', 'warn', 'error', 'print', 'pairs', 'ipairs', 'next', 'pcall', 'xpcall',
        'tonumber', 'tostring', 'typeof', 'coroutine', 'debug', 'newproxy', 'setmetatable', 'getmetatable'
      ],
      
      // Roblox service names
      robloxServices: [
        'Players', 'Workspace', 'ReplicatedStorage', 'ServerStorage', 'StarterGui', 'StarterPack',
        'Lighting', 'RunService', 'TweenService', 'UserInputService', 'ContextActionService',
        'SoundService', 'ContentProvider', 'Debris', 'HttpService', 'MarketplaceService',
        'PhysicsService', 'DataStoreService', 'GuiService', 'BadgeService', 'Teams'
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
              '@robloxGlobals': 'variable.predefined',
              '@robloxServices': 'variable.service',
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
          [/'/, 'string', '@string.\''],
          // Match Roblox method calls using : syntax
          [/:[a-zA-Z_]\w*/, 'method']
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
    
    // Register Lua code completion provider with Roblox specifics
    monaco.languages.registerCompletionItemProvider('lua', {
      provideCompletionItems: (model, position, context, token) => {
        const wordInfo = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: wordInfo.startColumn,
          endColumn: wordInfo.endColumn
        };

        // Common Lua suggestions
        const luaSuggestions = [
          { label: 'function', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'function', detail: 'Define a function', range },
          { label: 'local', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'local', detail: 'Declare a local variable', range },
          { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if ${1:condition} then\n\t${2}\nend', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'If statement', range },
          { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for ${1:i}=${2:1},${3:10} do\n\t${4}\nend', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'For loop', range },
          { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while ${1:condition} do\n\t${2}\nend', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'While loop', range },
          { label: 'print', kind: monaco.languages.CompletionItemKind.Function, insertText: 'print(${1})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Print to console', range },
          { label: 'return', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'return ${1}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Return statement', range }
        ];
        
        // Roblox-specific suggestions
        const robloxSuggestions = [
          { label: 'game:GetService', kind: monaco.languages.CompletionItemKind.Method, insertText: 'game:GetService("${1:ServiceName}")', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Get a Roblox service', range },
          { label: 'workspace', kind: monaco.languages.CompletionItemKind.Variable, insertText: 'workspace', detail: 'The Workspace service', range },
          { label: 'Instance.new', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Instance.new("${1:ClassName}")', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Create a new instance', range },
          { label: 'Vector3.new', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Vector3.new(${1:0}, ${2:0}, ${3:0})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Create a new Vector3', range },
          { label: 'CFrame.new', kind: monaco.languages.CompletionItemKind.Function, insertText: 'CFrame.new(${1:0}, ${2:0}, ${3:0})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Create a new CFrame', range },
          { label: 'Color3.fromRGB', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Color3.fromRGB(${1:255}, ${2:255}, ${3:255})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Create a Color3 from RGB values', range },
          { label: 'task.wait', kind: monaco.languages.CompletionItemKind.Function, insertText: 'task.wait(${1:seconds})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Wait for the specified time', range },
          { label: 'task.spawn', kind: monaco.languages.CompletionItemKind.Function, insertText: 'task.spawn(function()\n\t${1}\nend)', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Spawn a new thread', range }
        ];
        
        // Roblox service suggestions
        const serviceSuggestions = [
          { label: 'Players', kind: monaco.languages.CompletionItemKind.Class, insertText: 'Players', detail: 'The Players service', range },
          { label: 'ReplicatedStorage', kind: monaco.languages.CompletionItemKind.Class, insertText: 'ReplicatedStorage', detail: 'The ReplicatedStorage service', range },
          { label: 'TweenService', kind: monaco.languages.CompletionItemKind.Class, insertText: 'TweenService', detail: 'The TweenService for animations', range },
          { label: 'UserInputService', kind: monaco.languages.CompletionItemKind.Class, insertText: 'UserInputService', detail: 'The UserInputService for input handling', range },
          { label: 'RunService', kind: monaco.languages.CompletionItemKind.Class, insertText: 'RunService', detail: 'The RunService for game lifecycle events', range },
          { label: 'HttpService', kind: monaco.languages.CompletionItemKind.Class, insertText: 'HttpService', detail: 'The HttpService for web requests', range }
        ];
        
        return {
          suggestions: [...luaSuggestions, ...robloxSuggestions, ...serviceSuggestions]
        };
      }
    });
  }
};

// Default Lua script example with Roblox API usage
export const defaultLuaScript = `-- Roblox Lua script example
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")

-- Get the local player
local LocalPlayer = Players.LocalPlayer
local Character = LocalPlayer.Character or LocalPlayer.CharacterAdded:Wait()

-- Function to print all players in the game
local function printAllPlayers()
    print("Players in game:")
    for _, player in pairs(Players:GetPlayers()) do
        print("- " .. player.Name)
    end
end

-- Function to change the walkspeed of the local player
local function setWalkSpeed(speed)
    if Character and Character:FindFirstChild("Humanoid") then
        Character.Humanoid.WalkSpeed = speed
    end
end

-- Create a simple part
local function createPart()
    local part = Instance.new("Part")
    part.Anchored = true
    part.Size = Vector3.new(4, 1, 4)
    part.Position = Character.HumanoidRootPart.Position + Vector3.new(0, 5, 0)
    part.BrickColor = BrickColor.new("Bright blue")
    part.Parent = workspace
    
    -- Animate the part
    local tweenInfo = TweenInfo.new(2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
    local tween = TweenService:Create(part, tweenInfo, {
        Position = part.Position + Vector3.new(0, 10, 0),
        Transparency = 1
    })
    tween:Play()
    
    -- Clean up
    task.delay(2, function()
        part:Destroy()
    end)
end

-- Execute commands
printAllPlayers()
setWalkSpeed(25)
createPart()
print("Script executed successfully!")
`;

