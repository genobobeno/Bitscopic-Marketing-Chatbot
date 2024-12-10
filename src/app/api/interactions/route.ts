import { NextResponse } from 'next/server';
import { saveInteraction } from '@/lib/db/database';

export async function POST(request: Request) {
  try {
    const { user_message, ai_response, user_rating, user_comments } = await request.json();

    const result = await saveInteraction({
      user_message,
      ai_response,
      user_rating,
      user_comments
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving interaction:', error);
    return NextResponse.json(
      { error: 'Failed to save interaction' },
      { status: 500 }
    );
  }
} 