'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Settings,
  CodeIcon,
  MessageSquare,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  SubscriptIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Freecouter from './freecouter';

const montserrat = Montserrat({ weight: '600', subsets: ['latin'] });

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Conversation',
    icon: MessageSquare,
    href: '/conversation',
    color: 'text-violet-500',
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    href: '/image',
    color: 'text-pink-700',
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    href: '/video',
    color: 'text-orange-700',
  },
  {
    label: 'Music Generation',
    icon: MusicIcon,
    href: '/music',
    color: 'text-emerald-500',
  },
  {
    label: 'Code Generation',
    icon: CodeIcon,
    href: '/code',
    color: 'text-green-700',
  },
  {
    label: 'Subscription Status',
    icon: SubscriptIcon,
    href: '/settings',
  },
];

function Sidebar({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [subscriptionActive, setSubscriptionActive] = useState(false);
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
    <div className='space-y-4 py-4 flex flex-col h-full bg-[#111827]'>
      <div className='px-3 py-2 flex-1'>
        <Link href={'/dashboard'} className='flex items-center pl-3 mb-14' onClick={onClose}>
          <div className='relative w-8 h-8 mr-4'>
            <Image fill alt='logo' src={'/logo.svg'} />
          </div>
          <h1 className={cn(`text-2xl font-bold`, montserrat.className)}>Creatix</h1>
        </Link>

        <div className='space-y-1'>
          {routes?.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                `text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition`,
                pathname === item.href ? 'text-white bg-white/20' : 'text-zinc-400'
              )}
              onClick={onClose}
            >
              <div className='flex items-center flex-1'>
                <item.icon className={cn('h-5 w-5 mr-3', item.color)} />
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Conditionally render Freecouter if subscription is not active */}
      {!subscriptionActive && <Freecouter />}
    </div>
  );
}

export default Sidebar;
