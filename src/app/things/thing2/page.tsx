import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Thing 2 page
          </h1>

          <div className="m-x-auto m-y-6 max-w-[500px]">
            <h3 className="mb-10 text-2xl">a different page</h3>

            <p>note in the folder structure, we have:</p>

            <ul className="m-x-3 mt-4 list-inside list-disc rounded border border-gray-300 p-3">
              <li>app / things / thing2</li>
              <li>
                then page.tsx inside of things/thing2 dir ... path is
                /things/thing2 in the URL
              </li>
            </ul>
          </div>
          <div>
            <Link
              href="/"
              className="rounded-full bg-black/10 px-10 py-3 font-semibold no-underline transition hover:bg-black/20"
            >
              Back home
            </Link>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
