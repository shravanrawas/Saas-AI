'use client';

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Typewriter from 'typewriter-effect';
import { Button } from "./ui/button";

export const Landinghero = () => {

    const {isSignedIn} = useAuth();

    return (
        <div className="text-white font-bold py-36 text-center space-y-5">
           <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
              <h1>The Best AI Tool For</h1>
              <div className="text-orange-200">
               <Typewriter
               options={{
                strings: [
                    'Conversation.',
                    'Image Generation.',
                    'Music Generation.',
                    'Video Generation.',
                    'Code Generation.'
                ],
                autoStart: true,
                loop: true
               }}
               />
              </div>
           </div>
           <div className="text-sm md:text-xl font-light text-zinc-400">
                Transform Ideas into Content with AI Speed.
           </div>
           <div>
            <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
                 <Button variant={'outline'} className="md:text-lg p-4 md:p-6 text-black rounded-full font-semibold">
                    Start Generating For Free
                 </Button>
            </Link>
           </div>
           <div className="text-zinc-400 text-xs md:text-sm font-normal">
                No credits required.
           </div>
        </div>
    )
}
