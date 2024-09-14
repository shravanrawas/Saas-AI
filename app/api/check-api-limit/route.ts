import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constansts";

export async function GET(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ isAllowed: false }), { status: 401 });
  }

  const userApiLimit = await prismadb.userApilimit.findUnique({
    where: { userId },
  });

  const count = userApiLimit ? userApiLimit.count : 0;
  const isAllowed = count < MAX_FREE_COUNTS;

  return new Response(
    JSON.stringify({ isAllowed, count }), 
    { status: 200 }
  );
}
