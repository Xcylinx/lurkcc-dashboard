
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface CodeBoxProps {
  licenseKey: string;
}

const CodeBox = ({ licenseKey }: CodeBoxProps) => {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  const codeWithKey = `getgenv().key = '${licenseKey}'
loadstring(game:HttpGet('https://kya.jvck.net/aura'))()`;

  const codeWithHiddenKey = `getgenv().key = '${"*".repeat(licenseKey.length)}'
loadstring(game:HttpGet('https://kya.jvck.net/aura'))()`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeWithKey);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      whileHover={{ 
        boxShadow: "0 0 15px 0 rgba(138, 75, 175, 0.2)",
        transition: { duration: 0.2 } 
      }}
    >
      <Card className="glass-morphism border-white/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Loader Code</CardTitle>
            <CardDescription>Copy and paste this code to use the client</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 relative overflow-hidden"
              onClick={() => setShowKey(!showKey)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div
                initial={false}
                animate={{ 
                  opacity: [1, 0, 1], 
                  scale: [1, 0.8, 1],
                  rotate: showKey ? 180 : 0 
                }}
                transition={{ 
                  duration: 0.3, 
                  times: [0, 0.5, 1]
                }}
                key={showKey ? "eyeoff" : "eye"}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </motion.div>
              <span className="sr-only">{showKey ? "Hide" : "Show"} key</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 relative overflow-hidden"
              onClick={copyToClipboard}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div
                initial={false}
                animate={{ 
                  opacity: [1, 0, 1], 
                  scale: [1, 0.8, 1] 
                }}
                transition={{ 
                  duration: 0.3, 
                  times: [0, 0.5, 1]
                }}
                key={copied ? "check" : "copy"}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </motion.div>
              <span className="sr-only">Copy code</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="code-box relative overflow-hidden rounded-md user-select-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{ userSelect: "none" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
            <pre className="text-sm">
              <code>
                <span className="code-line">
                  <span className="code-keyword">getgenv</span>().
                  <span className="code-variable">key</span> = 
                  <span className="code-string">'{showKey ? licenseKey : "*".repeat(licenseKey.length)}'</span>
                </span>
                <span className="code-line">
                  <span className="code-keyword">loadstring</span>(
                  <span className="code-variable">game</span>:
                  <span className="code-function">HttpGet</span>(
                  <span className="code-string">'https://kya.jvck.net/aura'</span>))()
                </span>
              </code>
            </pre>
            
            {/* Animated particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-px w-8 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
                  initial={{ 
                    left: "-10%", 
                    top: `${20 + i * 15}%`,
                    opacity: 0.3 + (i * 0.1)
                  }}
                  animate={{
                    left: "110%",
                  }}
                  transition={{
                    duration: 2 + i,
                    repeat: Infinity,
                    repeatDelay: i * 2,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CodeBox;
