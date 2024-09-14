
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: { userId: params.userId },
  });

  if (!userSubscription) {
    return NextResponse.json({ subscriptionActive: false });
  }

  return NextResponse.json({
    subscriptionActive: userSubscription.subscriptionActive,
  });
}
