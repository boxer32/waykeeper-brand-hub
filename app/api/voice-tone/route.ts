// file: app/api/voice-tone/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runVoiceTone } from '../../../lib/voice-tone-api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Voice Tone API called');
    
    const { scenario, audience, userText } = await request.json();
    console.log('📝 Request data:', { scenario, audience, userText: userText?.substring(0, 50) + '...' });

    if (!scenario || !audience || !userText) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: scenario, audience, userText' },
        { status: 400 }
      );
    }

    console.log('🚀 Calling runVoiceTone...');
    const result = await runVoiceTone({
      scenario,
      audience,
      userText,
    });
    console.log('✅ runVoiceTone completed:', { textLength: result.text?.length, threadId: result.threadId });

    // Parse JSON response
    let analysisData = null;
    try {
      analysisData = JSON.parse(result.text);
    } catch (error) {
      console.error('❌ Failed to parse JSON response:', error);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: analysisData,
      threadId: result.threadId,
    });

  } catch (error) {
    console.error('❌ Voice Tone API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process voice tone request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
