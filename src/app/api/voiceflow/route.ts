import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

const USER_ID = uuidv4();

async function handleVoiceflowRequest(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: "Error from Voiceflow API" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const projectId = "66d20b71a0ae310266c219d0";
  const authKey = "VF.DM.66d2b8815a38744f37738f6e.9dipbIRsunGudDVk";
  const versionID = "66d20b71a0ae310266c219d1";
  const url = `https://general-runtime.voiceflow.com/state/user/${USER_ID}/interact`;

  const options: RequestInit = {
    method: "POST",
    headers: {
      accept: "application/json",
      versionId: "production",
      "content-type": "application/json",
      Authorization: authKey || "",
    },
    body: JSON.stringify({
      action: { type: "launch" },
      config: {
        tts: false,
        stripSSML: true,
        stopAll: true,
        excludeTypes: ["block", "debug", "flow"],
      },
    }),
  };

  return handleVoiceflowRequest(url, options);
}

export async function POST(request: NextRequest) {
  const { text } = (await request.json()) as { text: string };
  const projectId = "66d20b71a0ae310266c219d0";
  const authKey = "VF.DM.66d2b8815a38744f37738f6e.9dipbIRsunGudDVk";
  const versionID = "66d20b71a0ae310266c219d1";
  const url = `https://general-runtime.voiceflow.com/state/user/${USER_ID}/interact`;

  const options: RequestInit = {
    method: "POST",
    headers: {
      accept: "application/json",
      versionId: "production",
      "content-type": "application/json",
      Authorization: authKey || "",
    },
    body: JSON.stringify({
      action: { type: "text", payload: text },
      config: {
        tts: false,
        stripSSML: true,
        stopAll: true,
        excludeTypes: ["block", "debug", "flow"],
      },
    }),
  };

  return handleVoiceflowRequest(url, options);
}
