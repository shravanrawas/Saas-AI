'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Replicate from 'replicate'; 
import Heading from '@/components/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VideoIcon } from 'lucide-react';
import { formSchema } from './constanst';
import Empty from '@/components/empty';
import Loader from '@/components/loader';

const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
});

function Videopage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    const input = {
      fps: 24,
      width: 1024,
      height: 576,
      prompt: data.prompt,
      guidance_scale: 17.5,
      negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken",
    };

    try {
      const output = await replicate.run(
        "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
        { input }
      );
      setVideoUrl(output);
    } catch (err) {
      console.error('Error generating video:', err.message);
      setError(`Error generating video: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Heading 
        title="Video Generation" 
        description="Generate videos from text prompts" 
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
            <FormField name="prompt" render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-0">
                  <Input 
                    className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                    placeholder="Enter text prompt..." 
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}/>
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
              <Loader text={'Generating...'}/>
            </div>
          )}
          {error && !isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted text-red-500">
              <p>{error}</p>
            </div>
          )}
          {!videoUrl && !isLoading && !error && (
            <Empty label="No video generated." />
          )}
          {videoUrl && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <video src={videoUrl} alt="Generated video" controls />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Videopage;
