import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userApiLimit = await prismadb.userApilimit.findUnique({
    where: { userId },
  });

  if (userApiLimit) {
    await prismadb.userApilimit.update({
      where: { userId },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prismadb.userApilimit.create({
      data: { userId, count: 1 },
    });
  }

  return new Response('API limit increased', { status: 200 });
}