'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Heading from '@/components/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MusicIcon } from 'lucide-react';
import { formSchema } from './constanst';
import Empty from '@/components/empty';
import Loader from '@/components/loader';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { increaseApiLimit , checkApiLimit} from '@/lib/api';
import { userpromodal } from '@/hooks/user-pro-modal';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';


const API_ENDPOINT = 'https://api-inference.huggingface.co/models/facebook/musicgen-small';

function Musicpage() {
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const promodal = userpromodal();
  const { user } = useUser();
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

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

  const onSubmit = async (data: any) => {
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
      
      const response = await fetch(API_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: data.prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);

      setMusicUrl(url);
    } catch (error) {
      console.error('Error generating music:', error);
      setMusicUrl(null);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <Heading
        title="Music Generation"
        description="Generate music from text prompts"
        icon={MusicIcon}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
                    placeholder="Enter text prompt (e.g., '90s rap')..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )} />
            <Button
              type="submit"
              className="col-span-12 lg:col-span-2 w-full"
              disabled={isLoading}
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
          {!musicUrl && !isLoading && (
            <Empty label="No music generated." />
          )}
          {musicUrl && (
            <div className="mt-4">
              <AudioPlayer
                src={musicUrl}
                onPlay={e => console.log("Playing")}
                className="w-full" 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Musicpage;
