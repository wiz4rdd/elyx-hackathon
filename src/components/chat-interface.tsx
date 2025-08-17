
"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { teamMembers } from "@/lib/data"
import type { TeamMember, Message } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNowStrict } from 'date-fns'
import { Loader2, RefreshCw } from "lucide-react"

interface ChatInterfaceProps {
  messageContent: string;
  onRegenerate: () => void;
  isGenerating: boolean;
}

const ROHAN_AVATAR = "https://placehold.co/40x40.png?text=RP";
const ELYX_BOT_AVATAR = "https://placehold.co/40x40.png?text=EB";

export function ChatInterface({ messageContent, onRegenerate, isGenerating }: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const allContacts = useMemo(() => [{ name: 'Rohan Patel', role: 'Member', avatar: ROHAN_AVATAR }, ...teamMembers], []);

  const parsedMessages = useMemo(() => {
    if (!messageContent) return [];
    
    const messages: Omit<Message, 'id' | 'timestamp'>[] = [];
    const lines = messageContent.split('\n');
    let currentSender: string | null = null;
    let currentText = '';

    const senderNames = allContacts.map(c => c.name);

    for (const line of lines) {
        if (!line.trim()) continue;

        let foundSender = false;
        for (const name of senderNames) {
            if (line.startsWith(`${name}:`)) {
                // If there's a pending message, push it to the array
                if (currentSender && currentText.trim()) {
                    const contact = allContacts.find(c => c.name === currentSender);
                    messages.push({
                        sender: currentSender,
                        text: currentText.trim(),
                        avatar: contact?.avatar || ELYX_BOT_AVATAR
                    });
                }
                // Start a new message
                currentSender = name;
                currentText = line.substring(name.length + 1).trim();
                foundSender = true;
                break;
            }
        }
        
        // If it's a continuation of the previous message
        if (!foundSender && currentSender) {
            currentText += '\n' + line;
        }
    }

    // Add the last message
    if (currentSender && currentText.trim()) {
        const contact = allContacts.find(c => c.name === currentSender);
        messages.push({
            sender: currentSender,
            text: currentText.trim(),
            avatar: contact?.avatar || ELYX_BOT_AVATAR
        });
    }

    const totalSecondsIn8Months = 8 * 30 * 24 * 60 * 60;
    const now = new Date();

    return messages.map((msg, index) => {
        const secondsAgo = totalSecondsIn8Months - (index / messages.length) * totalSecondsIn8Months;
        const timestampDate = new Date(now.getTime() - secondsAgo * 1000);
        return {
            ...msg,
            id: index,
            timestamp: formatDistanceToNowStrict(timestampDate, { addSuffix: true }),
        }
    });

  }, [messageContent, allContacts]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableViewport) {
            scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
        }
    }
  }, [parsedMessages]);


  return (
    <div className="flex h-screen max-h-screen">
      <div className="flex-1 flex flex-col bg-secondary/30">
        <div className="flex items-center justify-between p-4 border-b bg-background shadow-sm">
            <div className="flex items-center gap-3">
                <p className="font-semibold">Rohan's Communication History</p>
            </div>
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
             Regenerate
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {parsedMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-3",
                  message.sender === "Rohan Patel" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender !== "Rohan Patel" && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-md rounded-lg px-4 py-2",
                    message.sender === "Rohan Patel"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background shadow-sm"
                  )}
                >
                  <p className="font-semibold text-sm mb-1">{message.sender}</p>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={cn("text-xs mt-1",
                     message.sender === "Rohan Patel" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {message.timestamp}
                  </p>
                </div>
                 {message.sender === "Rohan Patel" && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={message.avatar} data-ai-hint="man portrait"/>
                        <AvatarFallback>RP</AvatarFallback>
                    </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
