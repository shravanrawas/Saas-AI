'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Heading from '@/components/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { formSchema } from './constanst';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Empty from '@/components/empty';
import Loader from '@/components/loader';
import { useUser } from '@clerk/nextjs';
import Typewriter from 'typewriter-effect';
import { increaseApiLimit, checkApiLimit } from '@/lib/api';
import { userpromodal } from '@/hooks/user-pro-modal';

function Conversationpage() {
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const promodal = userpromodal();
  const chatEndRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const res = await fetch(`/api/subscription/${user?.id}`);
        if (res.ok) {
          const data = await res.json();
          setSubscriptionActive(data.subscriptionActive);
        } else {
          setSubscriptionActive(false);
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        setSubscriptionActive(false);
      }
    };

    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (!subscriptionActive) {
        const isLimitValid = (await checkApiLimit()).isAllowed;
        if (!isLimitValid) {
          promodal.onOpen();
          setIsLoading(false);
          return;
        }
        increaseApiLimit();
      }

  
      const userMessage = { type: 'user', message: data.prompt };
      const newConversation = [...conversation, userMessage];
      setConversation(newConversation);

      
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(data.prompt);
      const aiResponse = await result.response.text();

      const aiMessage = { type: 'ai', message: aiResponse };
      setConversation((prev) => [...prev, aiMessage]);

      setIsLoading(false);
      form.reset();
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (conversation.length >= 2 && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  return (
    <div>
      <Heading
        title="Conversation"
        description="Most powerful AI model"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField name="prompt" render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-0">
                  <Input
                    className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                    placeholder="How can I help you?"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )} />
            <Button
              type="submit"
              className="col-span-12 lg:col-span-2 w-full"
            >
              Generate
            </Button>
          </form>
        </Form>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader text={'Generating...'} />
            </div>
          )}
          {!conversation.length && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col gap-y-4">
            {conversation.map((message, index) => (
              <React.Fragment key={index}>
                {message.type === 'user' && (
                  <div className="p-4 w-full flex items-center gap-x-4 rounded-lg self-end justify-end text-right">
                    <div className="text-lg whitespace-pre-wrap bg-gray-200 p-4 rounded-md">
                      {message.message}
                    </div>
                    <img
                      src={user?.imageUrl}
                      alt="User Avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                )}
                <div ref={chatEndRef} />
                {message.type === 'ai' && (
                  <div className="p-4 w-full flex flex-col items-start gap-x-4 rounded-lg mb-2 self-start justify-start text-left">
                    <img
                      src="/logo.svg"
                      alt="AI Avatar"
                      className="h-10 w-10 rounded-full mb-4"
                    />
                    <div className="text-lg whitespace-pre-wrap bg-gray-200 p-4 rounded-md">
                      <Typewriter
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(message.message)
                            .callFunction(() => {
                              typewriter.stop();
                            })
                            .start();
                        }}
                        options={{
                          delay: 10,
                          cursor: ''
                        }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conversationpage;
