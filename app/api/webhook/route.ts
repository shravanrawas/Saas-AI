import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const {userId} = auth();

  if (!userId || typeof userId !== 'string') {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log("User ID:", userId);

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: { userId: userId as string }, 
  });
  

  if (userSubscription) {
    await prismadb.userSubscription.update({
      where: { userId },
      data: { subscriptionActive: true },
    });
  } else {
    await prismadb.userSubscription.create({
      data: { userId, subscriptionActive: true },
    });
  }

  return new Response('Subscription activated', { status: 200 });
}
