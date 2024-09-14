'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VideoIcon } from 'lucide-react';
import Heading from '@/components/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formSchema } from './constanst';
import Empty from '@/components/empty';
import Loader from '@/components/loader';
import { increaseApiLimit , checkApiLimit} from '@/lib/api';
import { userpromodal } from '@/hooks/user-pro-modal';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

function Videopage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const { user } = useUser();
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const promodal = userpromodal();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const pollForVideo = async (videoId: string) => {
    const pollingInterval = 5000;
    let videoGenerated = false;

    while (!videoGenerated) {
      const response = await fetch(`https://tavusapi.com/v2/videos/${videoId}`, {
        headers: {
          'x-api-key': `${process.env.NEXT_PUBLIC_TAVUS_API_KEY}`,
        },
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        if (result.generation_progress === '100/100') {
          const downloadUrl = result.download_url;

          const videoBlob = await fetch(downloadUrl).then(res => res.blob());
          const videoBlobUrl = URL.createObjectURL(videoBlob);

          setVideoUrl(videoBlobUrl);
          videoGenerated = true;
        } else {
          setProgress(result.generation_progress);
          await new Promise(resolve => setTimeout(resolve, pollingInterval));
        }
      } else {
        setError(result.message || 'Failed to retrieve video status');
        videoGenerated = true;
      }
    }

    setIsLoading(false);
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

  const onSubmit = async (data: { prompt: string }) => {
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    setProgress(null);

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
      
      const response = await fetch('https://tavusapi.com/v2/videos', {
        method: 'POST',
        headers: {
          'x-api-key': `${process.env.NEXT_PUBLIC_TAVUS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replica_id: 'r79e1c033f',
          script: data.prompt,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        await pollForVideo(result.video_id);
      } else {
        setError(result.message || 'Failed to generate video');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred while generating the video');
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Generate videos from text script"
        icon={VideoIcon}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      placeholder="Enter text script..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
          {isLoading && !videoUrl && !error && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              {!progress && <Loader text={'Generating...'} />}
              {progress && <p>Video creation is in progress. Update: {progress}</p>}
            </div>
          )}
          {error && !isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted text-red-500">
              {error} - API limit is exhausted.
            </div>
          )}
          {!videoUrl && !isLoading && !error && (
            <Empty label="No video generated." />
          )}
          {videoUrl && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <video
                src={videoUrl}
                controls
                width="100%"
                height="auto"
                preload="auto"
                onError={() => setError('Failed to load video')}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Videopage;
