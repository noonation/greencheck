/**
 * WORK
 * IN
 * PROGRESS
 *
 * custom sign-in page, grabbing some parts from next-auth docs
 *
 * all commented out so the app builds,
 */

// import type {
//   GetServerSidePropsContext,
//   InferGetServerSidePropsType,
// } from "next";
// import { getProviders, signIn } from "next-auth/react";
// import { getServerSession } from "next-auth/next";
// // import { authOptions } from "../api/auth/[...nextauth]"

// export default function SignIn({
//   providers,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   return (
//     <>
//       {Object.values(providers).map((provider) => (
//         <div key={provider.name}>
//           <button onClick={() => signIn(provider.id)}>
//             Sign in with {provider.name}
//           </button>
//         </div>
//       ))}
//     </>
//   );
// }

export default function Stub() {
  return <h1>hai there stub page for where custom signin UI will live</h1>;
}

// looks like next-auth docs are not quite up to date, as next server is complaining about this
// not allowed in app/ tree (client)
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = true; // await getServerSession(context.req, context.res, authOptions)

//   // If the user is already logged in, redirect.
//   // Note: Make sure not to redirect to the same page
//   // To avoid an infinite loop!
//   if (session) {
//     return { redirect: { destination: "/" } };
//   }

//   const providers = await getProviders();

//   return {
//     props: { providers: providers ?? [] },
//   };
// }

// export default async function SignInPage() {
//   return (
//     <div className="relative flex h-full w-full overflow-hidden">
//       <div
//         aria-label="Slate cover background"
//         className="absolute left-0 top-0 z-10 flex h-[275%] w-[150%] translate-x-[-70%] translate-y-[-28%] rotate-[22deg] items-center bg-zinc-900 md:translate-y-[-15%] md:rotate-[11deg]"
//       ></div>
//       <div className="z-20 flex h-dvh w-full items-center justify-center md:ml-[15%] md:w-[22rem]">
//         <div className="flex w-80 flex-col items-center justify-center text-xl">
//           <h2 className="mb-4 flex items-center space-x-2 text-3xl font-light text-zinc-600">
//             {/* add greencheck logo here */}
//             <span className="text-4xl font-medium text-white">
//               Greencheck: Claim yourself
//             </span>
//           </h2>
//           <div className="m-8 flex w-full flex-col gap-2 rounded bg-white p-6 shadow-lg">
//             {Object.values(providerMap).map((provider) => (
//               <form
//                 className="[&>div]:last-of-type:hidden"
//                 key={provider.id}
//                 action={async (formData) => {
//                   "use server";
//                   if (provider.id === "credentials") {
//                     await signIn(provider.id, {
//                       redirectTo: "/",
//                       password: formData.get("password"),
//                     });
//                   } else {
//                     await signIn(provider.id, { redirectTo: "/" });
//                   }
//                 }}
//               >
//                 {provider.id === "credentials" && (
//                   <>
//                     <label className="text-base font-light text-neutral-800">
//                       Password
//                       <input
//                         className="block w-full flex-1 rounded-md border border-gray-200 p-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
//                         required
//                         data-1p-ignore
//                         placeholder="password"
//                         name="password"
//                         type="password"
//                       />
//                     </label>
//                   </>
//                 )}
//                 <button
//                   type="submit"
//                   className="mt-2 flex h-12 w-full items-center justify-center space-x-2 rounded bg-zinc-800 px-4 text-base font-light text-white transition hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2"
//                 >
//                   <span>Sign in with {provider.name}</span>
//                 </button>
//                 <div className="my-4 flex items-center gap-2">
//                   <div className="h-[1px] flex-1 bg-neutral-300" />
//                   <span className="text-xs uppercase leading-4 text-neutral-500">
//                     or
//                   </span>
//                   <div className="h-[1px] flex-1 bg-neutral-300" />
//                 </div>
//               </form>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
