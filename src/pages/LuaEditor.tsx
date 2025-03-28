
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import LuaCodeEditor from "../components/LuaCodeEditor";
import EditorToolbar from "../components/EditorToolbar";
import { defaultLuaScript } from "../utils/luaEditorConfig";

const LuaEditor = () => {
  const [code, setCode] = useState(defaultLuaScript);
  const [copied, setCopied] = useState(false);
  
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
              <LuaCodeEditor
                code={code}
                onChange={(value) => setCode(value || "")}
              />
            </div>
            
            <EditorToolbar
              code={code}
              copied={copied}
              onCopy={handleCopy}
              onSave={handleSave}
              onExecute={handleExecute}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LuaEditor;
