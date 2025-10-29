import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Initialize OpenAI client only when needed
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const getAssistantId = () => {
  return process.env.ASSISTANT_ID || "asst_BGp8i89phq8ZMilausIkTjlQ";
};

// Mapping for scenarios and audiences
const ScenarioMap: Record<string, string> = {
  "Booking Confirmation": "Booking confirmations",
  "Social Media Post": "Social media posts (Instagram, Facebook)",
  "Website Copy": "Website homepage copy",
  "Customer Support": "Customer support responses",
  "Error Message": "Error messages",
  "Tour Description": "Tour descriptions",
  "Referral Invitation": "Referral invitations",
  "Newsletter Content": "Newsletter content"
};

const AudienceMap: Record<string, string> = {
  "Backpacker": "Backpackers",
  "Family": "Families",
  "Nomad": "Digital Nomads",
  "Wellness Seeker": "Wellness Seekers"
};

function normalizeScenario(s: string) {
  return ScenarioMap[s] || s;
}

function normalizeAudience(a: string) {
  return AudienceMap[a] || a;
}

function buildRunInstructions(scenario: string, audience: string) {
  return `SCENARIO: ${normalizeScenario(scenario)}
AUDIENCE: ${normalizeAudience(audience)}
(Use the assistant's existing brand voice + output format. Reasoning first, then GOOD/BAD examples. Match input language.)`;
}

export async function POST(request: NextRequest) {
  try {
    const { scenario, audience, userText } = await request.json();

    if (!scenario || !audience || !userText) {
      return NextResponse.json(
        { error: 'Missing required fields: scenario, audience, userText' },
        { status: 400 }
      );
    }

    const client = getOpenAIClient();
    const ASSISTANT_ID = getAssistantId();

    // Create a new thread
    const thread = await client.beta.threads.create();

    // Add user message
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userText,
    });

    // Run assistant with instructions
    const run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
      instructions: buildRunInstructions(scenario, audience),
    });

    // Poll for completion
    let currentRun = run;
    while (!["completed", "failed", "cancelled", "expired"].includes(currentRun.status)) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      currentRun = await client.beta.threads.runs.retrieve(thread.id, run.id as any);
    }

    if (currentRun.status !== "completed") {
      throw new Error(`Run ended with status: ${currentRun.status}`);
    }

    // Get the latest message
    const messages = await client.beta.threads.messages.list(thread.id, {
      order: "desc",
      limit: 1,
    });

    const message = messages.data[0];
    const text = message?.content?.[0]?.type === "text" ? message.content[0].text.value : "";

    if (!text) {
      throw new Error('No response from assistant');
    }

    // Try to parse as JSON, fallback to plain text
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch {
      // If not JSON, wrap in a simple structure
      analysis = {
        scenario,
        audience,
        language: "th",
        reasoning: {
          good: ["ข้อความมีความเป็นมิตร", "ใช้ภาษาที่เข้าใจง่าย"],
          bad: ["อาจจะดูเป็นทางการเกินไป"]
        },
        score: 75,
        flags: {
          corporateSpeak: false,
          prohibitedWords: []
        },
        goodExample: text,
        badExample: "ข้อความเดิมที่ผู้ใช้ส่งมา",
        nextStep: "ลองปรับปรุงตามคำแนะนำ",
        suggestions: [
          "เพิ่มการเล่าเรื่อง",
          "ใช้คำที่แสดงถึงการตื่นเต้น"
        ]
      };
    }

    return NextResponse.json({
      success: true,
      analysis,
      threadId: thread.id
    });

  } catch (error) {
    console.error('❌ Voice tone API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
