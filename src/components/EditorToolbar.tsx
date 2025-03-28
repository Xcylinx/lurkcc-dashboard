
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Play, Save } from "lucide-react";
import { toast } from "sonner";

interface EditorToolbarProps {
  code: string;
  copied: boolean;
  onCopy: () => void;
  onSave: () => void;
  onExecute: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  code,
  copied,
  onCopy,
  onSave,
  onExecute,
}) => {
  return (
    <div className="p-4 border-t border-white/5 bg-black/30 flex justify-between items-center">
      <div className="space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onCopy}
          className="bg-white/5 hover:bg-white/10 border-white/10"
        >
          {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onSave}
          className="bg-white/5 hover:bg-white/10 border-white/10"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
      
      <Button 
        onClick={onExecute}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
      >
        <Play className="h-4 w-4 mr-1" />
        Execute in Roblox
      </Button>
    </div>
  );
};

export default EditorToolbar;
