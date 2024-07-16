"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { mock } from "node:test";
import { useState } from "react";
import { PingResponseType } from "~/server/noo/ping";
import { SendClaimResponseType, mock_data } from "~/server/noo/sendClaim";
import { api } from "~/trpc/react";
import { GreencheckErrorResponse } from "~/types/greencheck";

const sampleButtonClassNames =
  "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

export default function Thing2() {
  const [pingResponse, setPingResponse] = useState<
    PingResponseType | undefined
  >();
  const [sendClaimResponse, setSendClaimResponse] = useState<
    SendClaimResponseType | undefined
  >();
  const [pingError, setPingError] = useState<
    GreencheckErrorResponse | undefined
  >();
  const [sendClaimError, setSendClaimError] = useState<
    GreencheckErrorResponse | undefined
  >();

  const session = useSession();
  console.log('session', session.data);

  const sendPing = api.ping.sendPing.useMutation({
    onMutate: () => {
      setPingResponse(undefined);
      setPingError(undefined);
    },
    onSuccess: (pingResponse) => {
      if ("error" in pingResponse) {
        setPingError(pingResponse);
      } else {
        setPingResponse(pingResponse);
      }
    },
  });

  const sendClaim = api.claim.sendClaim.useMutation({
    onMutate: () => {
      console.log("on mutate");
      setSendClaimResponse(undefined);
      setSendClaimError(undefined);
    },
    onSuccess: (sendClaimResponse) => {
      if ("error" in sendClaimResponse) {
        setSendClaimError(sendClaimResponse);
      } else {
        setSendClaimResponse(sendClaimResponse);
      }
    },
  });

  const handleSendPing = async (stringToPingWith?: string) => {
    sendPing.mutate({ reflect: stringToPingWith });
  };

  const handleSendSendClaim = async () => {
    console.log("handle send claim: data", mock_data);
    sendClaim.mutate(mock_data);
  };

  const { isPending: pingIsSending } = sendPing;

  return (
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

          <h3>Try out a tRPC call</h3>

          <p>Click one of the buttons below, see result.</p>

          <div className="flex flex-row gap-4">
            <button
              onClick={() => handleSendPing()}
              className={sampleButtonClassNames}
              disabled={!!pingIsSending}
            >
              Send Ping, empty
            </button>
            <button
              onClick={() => handleSendPing("hey I sent this")}
              className={sampleButtonClassNames}
              disabled={!!pingIsSending}
            >
              Send Ping, with reflector text "hey I sent this"
            </button>
            <button
              onClick={() => handleSendPing("throw-error")}
              className={sampleButtonClassNames}
              disabled={!!pingIsSending}
            >
              Send Ping, get error back
            </button>
            <button
              onClick={() => {
                setPingResponse(undefined);
                setPingError(undefined);
              }}
              className={sampleButtonClassNames}
              disabled={!!pingIsSending}
            >
              Clear response and error
            </button>
            <button
              onClick={() => handleSendSendClaim()}
              className={sampleButtonClassNames}
              disabled={!!pingIsSending}
            >
              Send Claim
            </button>
          </div>

          <div className="mt-2 flex flex-row gap-4 border border-red-500">
            <div>
              <p>Response:</p>
              {pingResponse ? (
                <pre>{JSON.stringify(pingResponse, null, 2)}</pre>
              ) : sendClaimResponse ? (
                <pre>{JSON.stringify(sendClaimResponse, null, 2)}</pre>
              ) : (
                <p>no response currently...</p>
              )}
            </div>
            <div>
              <p>Ping error:</p>
              {pingError ? (
                <pre>{JSON.stringify(pingError, null, 2)}</pre>
              ) : (
                <p>no error currently...</p>
              )}
            </div>
          </div>
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
  );
}
