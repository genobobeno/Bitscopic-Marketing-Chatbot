import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const ASSISTANT_ID = 'asst_m6XmLH05hkVoMWpAtZy54eod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, threadId } = body;
    
    console.log('Received request:', { messages, threadId });

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid or empty messages array');
    }

    // Create a thread if one doesn't exist
    const thread = threadId ? 
      await openai.beta.threads.retrieve(threadId) : 
      await openai.beta.threads.create();
    
    console.log('Thread:', thread.id);

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || !latestMessage.content) {
      throw new Error('Invalid message content');
    }

    // Add the new message to the thread
    const userMessage = await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: latestMessage.content,
    });
    
    console.log('User message created:', userMessage);

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });
    
    console.log('Run created:', run.id);

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      console.log('Run status:', runStatus.status);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    if (runStatus.status === 'completed') {
      // Get the messages after the run completes
      const messagesList = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messagesList.data[0]; // Get the most recent message
      
      console.log('Assistant response:', lastMessage);

      // Extract text content safely
      const textContent = lastMessage.content.find((content) => content.type === 'text');

      if (!textContent) {
        throw new Error('No text content in assistant response');
      }

      // Return the response
      return new Response(JSON.stringify({
        id: lastMessage.id,
        role: 'assistant',
        content: textContent.text.value,
        threadId: thread.id
      }));
    } else {
      throw new Error(`Run ended with status: ${runStatus.status}`);
    }
  } catch (error) {
    console.error('Assistant API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Error processing your request'
      }), 
      { status: 500 }
    );
  }
} 