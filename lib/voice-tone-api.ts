// file: lib/voice-tone-api.ts
import OpenAI from "openai";

const client = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});
const ASSISTANT_ID = process.env.ASSISTANT_ID || "asst_BGp8i89phq8ZMilausIkTjlQ";

// mapping ให้สะกดตรงกับ system instruction ของคุณ
const ScenarioMap: Record<string, string> = {
  "Booking Confirmation": "Booking confirmations",
  "Social Media Post": "Social media posts (Instagram, Facebook)",
  "Customer Support": "Customer support responses",
  "Newsletter Content": "Newsletter content",
  "Tour Description": "Tour descriptions",
  "Error Message": "Error messages",
  "Thank You Message": "Thank you messages",
  "Reminder Email": "Reminder emails",
  "FAQ Answer": "FAQ answers",
  "Referral Invitation": "Referral invitations",
  "Cancellation Email": "Cancellation/refund emails",
  "Website Homepage": "Website homepage copy"
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

// สั้น กระชับ: ส่งแค่ context รายครั้ง
function buildRunInstructions(scenario: string, audience: string) {
  return `SCENARIO: ${normalizeScenario(scenario)}
AUDIENCE: ${normalizeAudience(audience)}

Analyze the user's text for the above scenario and audience. Return a JSON response with this exact structure:
{
  "scenario": "${normalizeScenario(scenario)}",
  "audience": "${normalizeAudience(audience)}", 
  "language": "th",
  "reasoning": {
    "good": ["list specific good points about the text"],
    "bad": ["list specific bad points about the text"]
  },
  "score": 85,
  "flags": {
    "corporateSpeak": false,
    "prohibitedWords": []
  },
  "goodExample": "improved version of the user's text",
  "badExample": "what not to do example",
  "nextStep": "specific next step for the user",
  "suggestions": ["specific suggestions for improvement"]
}

IMPORTANT: 
- Use the EXACT scenario and audience provided above
- Analyze the actual user text, not generic examples
- Provide specific reasoning based on the actual text
- Generate examples relevant to the actual scenario and audience
- Use the assistant's existing brand voice guidelines. Match input language.`;
}

export async function runVoiceTone({
  scenario,
  audience,
  userText,
}: {
  scenario: string;
  audience: string;
  userText: string;
}) {
  try {
    // 1) สร้าง thread ใหม่
    const thread = await client.beta.threads.create();

    // 2) ใส่ข้อความผู้ใช้ (role: user)
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userText,
    });

    // 3) รัน assistant + ใส่ instructions รายครั้ง
    const run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
      instructions: buildRunInstructions(scenario, audience),
      response_format: { type: "json_object" }
    });

    // 4) รอให้เสร็จด้วย polling
    let attempts = 0;
    const maxAttempts = 30;
    let text = "";
    
    while (attempts < maxAttempts && !text) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
      
      const msgs = await client.beta.threads.messages.list(thread.id, {
        order: "desc",
        limit: 5,
      });
      
      const assistantMessage = msgs.data.find(msg => msg.role === "assistant");
      
      if (assistantMessage && assistantMessage.content && assistantMessage.content.length > 0) {
        text = assistantMessage.content[0].type === "text" ? assistantMessage.content[0].text.value : "";
      }
      
      console.log(`⏳ Attempt ${attempts}: ${text ? 'Got response' : 'No response yet'}`);
    }

    return { text, threadId: thread.id };
    
  } catch (error) {
    console.error('Voice Tone API Error:', error);
    throw error;
  }
}
