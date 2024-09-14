'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { MAX_FREE_COUNTS } from '@/constansts';
import { Progress } from "@/components/ui/progress";
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import { checkApiLimit } from '@/lib/api';
import { userpromodal } from '@/hooks/user-pro-modal';

function FreeCounter() {
    const [mounted, setMounted] = useState(false);
    const [apiCount, setApiCount] = useState(0);
    const [isAllowed, setIsAllowed] = useState(true);
    const promodal = userpromodal();

    useEffect(() => {
        const fetchApiLimit = async () => {
            const { isAllowed, count = 0 } = await checkApiLimit();
            setApiCount(count);
            setIsAllowed(isAllowed);
        }

        setMounted(true);
        fetchApiLimit();
    }, [apiCount]);

    if (!mounted) {
        return null;
    }

    return (
        <div className='px-3'>
            <Card className='bg-white/10 border-0'>
                <CardContent className='py-4'>
                    <div className='text-center text-sm text-white mb-4 space-y-2'>
                        <p>
                            {apiCount} / {MAX_FREE_COUNTS} Free Generations
                        </p>
                        <Progress
                            className='h-3'
                            value={(apiCount / MAX_FREE_COUNTS) * 100 || 0} 
                        />

                    </div>
                    <Button onClick={promodal.onOpen} variant={'outline'} className='w-full bg-orange-200 hover:bg-orange-100'>
                        Upgrade
                        <Zap className='w-4 h-4 ml-2 fill-white' />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default FreeCounter;