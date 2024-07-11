import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from GreenCheck" });
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  // bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            GreenCheck Sample App
          </h1>

          <p>The next auth bits need wiring up with your keys:</p>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-black/10 px-10 py-3 font-semibold no-underline transition hover:bg-black/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>

          {session?.user && <LatestPost />}

          <p>
            Just doing a little sample plain layout that matches up a little bit
            with Margie's design I saw.
          </p>
          <div className="flex min-w-full flex-row gap-8">
            <Link href="/things">
              <div className="h-[260px] border border-blue-400 p-8 transition-all hover:bg-slate-200 sm:w-[180px] xl:w-[360px]">
                <h2 className="sm:text-md m-0 font-extrabold tracking-tight md:text-xl">
                  Thing 1
                </h2>
                <p className="text-xs italic">(you can click me)</p>
              </div>
            </Link>
            <Link href="/things/thing2">
              <div className="h-[260px] border border-blue-400 p-8 transition-all hover:bg-slate-400 hover:text-white sm:w-[180px] xl:w-[360px]">
                <h2 className="sm:text-md m-0 font-extrabold tracking-tight md:text-xl">
                  Thing 2
                </h2>
                <p className="text-xs italic">(you can click me)</p>
              </div>
            </Link>
            <div className="min-h-[600px] flex-1 border border-blue-400 p-8">
              <h2 className="sm:text-md m-0 font-extrabold tracking-tight md:text-xl">
                The List of things
              </h2>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
