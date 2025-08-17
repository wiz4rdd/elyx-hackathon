"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Wand, Sparkles, Bot } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { generateMessages } from "@/ai/flows/generate-messages"
import { analyzeChat } from "@/ai/flows/analyze-chat"
import { memberPersona, teamRoles, topics, restrictions } from "@/lib/data"
import { ScrollArea } from "./ui/scroll-area"

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export function DecisionRationaleDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [conversation, setConversation] = useState<string | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<ChatMessage[]>([])
  const [userQuery, setUserQuery] = useState("")
  const { toast } = useToast()

  const handleGenerateConversation = async () => {
    setIsGenerating(true)
    setConversation(null)
    setAnalysisHistory([])
    try {
      const result = await generateMessages({
        memberPersona,
        teamRoles,
        topics,
        restrictions,
      })
      if (result.messages) {
        setConversation(result.messages)
        const summaryResult = await analyzeChat({
            chatHistory: result.messages,
            query: "Summarize this conversation in 3-4 sentences."
        })
        setAnalysisHistory([{ role: 'assistant', content: summaryResult.response }])
      } else {
        throw new Error("AI did not return any messages.")
      }
    } catch (error) {
      console.error("Failed to generate conversation:", error)
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate the chat simulation. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnalysisSubmit = async (query: string) => {
    if (!query.trim() || !conversation) return

    const newHistory: ChatMessage[] = [...analysisHistory, { role: 'user', content: query }]
    setAnalysisHistory(newHistory)
    setUserQuery("")
    setIsAnalyzing(true)

    try {
      const result = await analyzeChat({
        chatHistory: conversation,
        query: query,
      })
      setAnalysisHistory([...newHistory, { role: 'assistant', content: result.response }])
    } catch (error) {
      console.error("Failed to get analysis from AI", error)
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not get a response from the AI. Please try again.",
      })
       setAnalysisHistory(analysisHistory) // revert on error
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Wand className="mr-2" />
          Explain Decision Rationale
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Wand className="w-8 h-8 text-primary"/>
            AI-Powered Decision Rationale
            </DialogTitle>
          <DialogDescription>
            Understand the 'why' behind the health plan. This AI generates a simulated conversation and then answers your questions about it.
          </DialogDescription>
        </DialogHeader>
        
        {!conversation && !isGenerating && (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Sparkles className="w-12 h-12 text-primary mb-4"/>
                <p className="text-lg font-semibold mb-2">Explore the AI's reasoning</p>
                <p className="text-muted-foreground mb-6">Generate a simulated 8-month conversation to see the data-driven decisions in action.</p>
                <Button size="lg" onClick={handleGenerateConversation}>Generate Conversation</Button>
            </div>
        )}

        {isGenerating && (
             <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4"/>
                <p className="text-lg font-semibold">AI is thinking...</p>
                <p className="text-muted-foreground">Generating 8 months of simulated conversation history. This may take a moment.</p>
            </div>
        )}

        {conversation && (
            <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-lg">Generated Conversation</h3>
                    <ScrollArea className="flex-1 bg-secondary/30 rounded-lg p-4 h-0">
                        <pre className="text-sm whitespace-pre-wrap font-body">{conversation}</pre>
                    </ScrollArea>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-lg">Ask the AI</h3>
                    <ScrollArea className="flex-1 bg-secondary/30 rounded-lg p-4 space-y-4 h-0">
                         {analysisHistory.map((msg, index) => (
                            <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && <Bot className="w-6 h-6 shrink-0 text-primary" />}
                                <div className={`rounded-lg px-3 py-2 max-w-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                         {isAnalyzing && (
                            <div className="flex gap-2 justify-start">
                               <Bot className="w-6 h-6 shrink-0 text-primary" />
                               <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                               </div>
                            </div>
                        )}
                    </ScrollArea>
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleAnalysisSubmit(userQuery)
                        }}
                        className="flex items-center gap-2"
                    >
                        <Textarea 
                            placeholder="Ask a question about the conversation..."
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            disabled={isAnalyzing}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAnalysisSubmit(userQuery);
                                }
                            }}
                        />
                        <Button type="submit" disabled={!userQuery.trim() || isAnalyzing}>Send</Button>
                    </form>
                </div>
            </div>
        )}

      </DialogContent>
    </Dialog>
  )
}
