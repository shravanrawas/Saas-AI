'use client'

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Heading from '@/components/heading';
import { SubscriptIcon } from 'lucide-react';

function Settingspage() {
  const { user } = useUser();
  const [subscriptionActive, setSubscriptionActive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchSubscriptionStatus = async () => {
        try {
          const res = await fetch(`/api/subscription/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setSubscriptionActive(data.subscriptionActive);
          } else {
            setSubscriptionActive(false);
          }
        } catch (error) {
          console.error('Error fetching subscription status:', error);
          setSubscriptionActive(false);
        } finally {
          setLoading(false);
        }
      };

      fetchSubscriptionStatus();
    }
  }, [user]);

  return (
    <div>
      <Heading
        title='Subscription Status'
        description='See Details'
        icon={SubscriptIcon}
        iconColor='text-gray-700'
        bgColor='bg-gray-700/10'
      />

      <div className='px-4 lg:px-8 space-y-4'>
        {subscriptionActive ? (
          <div className='text-sm font-medium'>
          <div className='flex items-center text-green-600'>
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
            </svg>
            Your subscription is <strong className='ml-1'>active</strong>.
          </div>
          
          <div className='mt-2 text-gray-700'>
            Now you have <strong>unlimited access</strong> to all AI modal, including:
          </div>
        
          <ol className='list-disc list-inside mt-2 flex flex-col gap-2'>
            <li className='text-blue-600'>Image Generation</li>
            <li className='text-blue-600'>Video Generation</li>
            <li className='text-blue-600'>Music Generation</li>
            <li className='text-blue-600'>Conversations</li>
          </ol>
        </div>
        
        ) : (
          <div className='text-yellow-600 text-sm font-medium flex items-center'>
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M8 12h3m-3 0l3 3m0-3l3-3' />
            </svg>
            You are currently on a <strong className='ml-1'>free trial</strong>.
          </div>
        )}

      </div>
    </div>
  );
}

export default Settingspage;
