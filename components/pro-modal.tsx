import React, { useState , useEffect} from 'react'
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader} from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog';
import { userpromodal } from '@/hooks/user-pro-modal';
import { Badge } from './ui/badge';
import { Check, Code, ImageIcon, LoaderCircle, MessageSquare, MusicIcon, VideoIcon, Zap } from 'lucide-react'
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { activateSubscription } from '@/lib/api';

const tools = [
  {
    label: 'Conversation',
    icon: MessageSquare,
    color: 'text-violet-500',
    bgcolor: 'bg-violet-500/10',
    href: '/conversation'
  },
  {
    label: 'Music Generation',
    icon: MusicIcon,
    color: 'text-emerald-500',
    bgcolor: 'bg-emerald-500/10',
    href: '/music'
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: 'text-pink-700',
    bgcolor: 'bg-pink-700/10',
    href: '/image'
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    color: 'text-orange-700',
    bgcolor: 'bg-orange-700/10',
    href: '/video'
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: 'text-green-700',
    bgcolor: 'bg-green-700/10',
    href: '/code'
  }
]

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


function Promodal() {

  const promodal = userpromodal();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    activateSubscription();
    const stripe = await stripePromise;
  
    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      const { error } = await stripe!.redirectToCheckout({ sessionId: data.id });
  
      if (error) {
        console.error('Stripe checkout error:', error);
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
    } finally {
      setLoading(false);
    }
  };
  

  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={promodal.isOpen} onOpenChange={promodal.onClose}>
      <DialogContent>
        <DialogHeader>
            <DialogTitle className='flex justify-center items-center flex-col gap-y-4 pb-2'>
               <div className='flex items-center gap-x-2 font-bold py-1'>
               Upgrade to Creatix
               <Badge className='text-sm uppercase py-1'>
                  Pro
               </Badge>
               </div>
            </DialogTitle>
            <DialogDescription className='text-center pt-2 space-y-2 text-zinc-900 font-medium'>
                 {tools.map((tool) => (
                    <Card 
                    key={tool.label}
                    className='p-3 border-black/5 flex items-center justify-between' 
                    >
                       <div className='flex items-center gap-x-4'>
                            <div className={cn('p-2 w-fit rounded-md', tool.bgcolor)}>
                                <tool.icon className={cn('w-6 h-6', tool.color)}/>
                            </div>
                            <div className='font-semibold text-sm'>
                              {tool.label}
                            </div>
                       </div>
                       <Check className='text-primary w-5 h-5'/>
                    </Card>
                 ))}
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleCheckout} className='w-full' size='lg'>
           {loading ? <LoaderCircle className='animate-spin'/> : <>Upgrade Now<Zap className='w-4 h-4 ml-2 fill-white'/></>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Promodal
