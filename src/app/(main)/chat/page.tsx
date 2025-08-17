"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChatInterface } from "@/components/chat-interface"
import { generateMessages } from "@/ai/flows/generate-messages"
import { analyzeChat } from "@/ai/flows/analyze-chat"
import { memberPersona, teamRoles, topics, restrictions, kpiData, journeyData } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Bot, Sparkles, Wand } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [conversation, setConversation] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const { toast } = useToast()

  const handleGenerateMessages = async () => {
    setIsGenerating(true)
    setConversation(null)
    setChatHistory([])
    try {
      const result = await generateMessages({
        memberPersona,
        teamRoles,
        topics,
        restrictions,
        kpiData: JSON.stringify(kpiData),
        journeyData: JSON.stringify(journeyData),
      })
      if (result.messages) {
        setConversation(result.messages)
      } else {
        throw new Error("AI did not return any messages.")
      }
    } catch (error) {
      console.error("Failed to generate messages:", error)
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate the chat simulation. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleChatSubmit = async (query: string) => {
    if (!query.trim() || !conversation) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: query }];
    setChatHistory(newHistory);
    setUserQuery('');
    setIsAnalyzing(true);

    try {
      const result = await analyzeChat({
        chatHistory: conversation,
        query: query,
      });

      setChatHistory([...newHistory, { role: 'assistant', content: result.response }]);
    } catch (error) {
      console.error("Failed to get response from AI", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get a response. Please try again.",
      });
      // remove the user's last message on error
      setChatHistory(chatHistory);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      {conversation ? (
        <div className="flex h-screen max-h-screen">
            <ChatInterface messageContent={conversation} onRegenerate={handleGenerateMessages} isGenerating={isGenerating} />
            <div className="flex-1 flex flex-col bg-background border-l">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Wand className="w-8 h-8 text-primary"/> Chat Analysis
                  </CardTitle>
                  <CardDescription>
                    Summarize or ask questions about the generated conversation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="flex-1 bg-secondary/30 rounded-lg p-4 space-y-4 overflow-y-auto">
                    {chatHistory.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <Sparkles className="w-10 h-10 mb-2"/>
                        <p>Ask a question or type "Summarize" to begin.</p>
                      </div>
                    )}
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.role === 'assistant' && <Bot className="w-6 h-6 shrink-0 text-primary" />}
                           <div className={`rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
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
                  </div>
                  <form onSubmit={(e) => {
                      e.preventDefault();
                      handleChatSubmit(userQuery);
                    }}
                    className="flex items-center gap-2">
                    <Textarea
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="Ask a question or type 'Summarize'..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSubmit(userQuery);
                        }
                      }}
                      disabled={isAnalyzing}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!userQuery.trim() || isAnalyzing}>
                        Send
                    </Button>
                  </form>
                </CardContent>
            </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="max-w-lg text-center">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                <Bot className="w-8 h-8"/> Chat Simulation
              </CardTitle>
              <CardDescription>
                Generate an 8-month communication history between Rohan Patel and the Elyx team based on his persona and health journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGenerateMessages} disabled={isGenerating} size="lg">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Conversation"
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                This may take a moment as the AI simulates the entire journey.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
