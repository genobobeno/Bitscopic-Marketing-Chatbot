# AI Assistant App

You are a fullstack expert in TypeScript, Next.js App Router, React, Tailwind, OpenAI Assistants, Vercel, and postgres. You will follow @Next.js docs for Data Fetching, Rendering, and Routing. Use Vercel AI SDK for handling AI interactions with the OpenAI Assistant. Use postgres to log the interactions and user ratings of the assistant.

Your job is to create an interactive AI assistant application with the following specific features and key points to implement:

1. Integration with Vercel AI SDK, specifically its useAssistant hook:
   - Implement the Vercel AI SDK to handle all AI-related operations.
   - Use the SDK's built-in functions for launching an assistant interaction and managing client state.
   - If the OpenAI assistant has finished, allow the run to complete, and if the user asks another question, begin another run on the same thread.
   - The assistant will use the gpt-4o model.
   - The AI assistant's ID is 'asst_ndJbs5TXDlppEPxAs7jlqWE4'

2. Maintain the assistant's interaction state in the interface:
   - Develop a responsive UI with a scrollable message list, displaying user and AI messages.
   - Implement a fixed-position input field at the bottom of the interface.
   - Display the entire chat history above the input field, including previous interactions where applicable.

3. Streaming responses:
   - Utilize the Vercel AI SDK's streaming capabilities to display AI responses in real-time.
   - Implement a typing indicator while the AI is generating a response.

4. Ratings and User Comments:
   - On the right side of the interface, there should be a rating widget that appears after the assistant has finished responding to a user message.
   - The rating widget should have the option of choosing 1 thru 5 stars. 
   - When the user makes a rating, a text input field should appear as a pop-up window with a title above that says "Please suggest any necessary improvements:", along with a save button below the text field that will close the dialog when clicked. This pop-up window should also be able to be closed if the user does not have additional comments.
   - When the user clicks Save, four data objects should be captured as a row with a linked ID:
      1. the user's message, 
      2. the AI Assistant's response, 
      3. the user's rating,
      4. and the user's suggested improvements if the user enters text and saves the comment in the pop-up window.

5. Postgresql database for saving all data captured:
   - A USER_INTERACTION table should be created for data that is captured as a result of interactions with the assistant and the resulting users' ratings and comments.
   - This table should not require more than 6 columns.
   - The columns should be an INTERACTION_ID, USER_MESSAGE, AI_RESPONSE, USER_RATING, USER_COMMENTS, and INTERACTION_TIME.
   - The INTERACTION_ID should be an integer identity. 
   - The USER_MESSAGE, AI_RESPONSE, and USER_COMMENTS should be a text data type.
   - The USER_RATING should be a smallint.
   - The INTERACTION_TIME should be a timestamp and captured when the user enters a rating.

6. Comprehensive error handling and loading states:
   - Create informative error messages for various scenarios (e.g., API errors, network issues).
   - Implement loading spinners or skeleton loaders for all asynchronous operations.
   - Add retry mechanisms for failed API calls.
   - Ensure proper error handling and response formatting for the OpenAI Assistant.

7. AI Assistant's history management:
   - Use the postgresql data to implement a robust system to maintain and display the user and AI assistant's history correctly.
   - Store the history in the postgresql database for persistence across sessions.
   - Provide options to clear the visible chat history from the UI, but do not clear any data from the postgresql USER_INTERACTION table. 

8. Vercel AI SDK integration for interactions and streaming:
   - Utilize the SDK's built-in hooks (e.g., useAssistant) for managing the assistant's message state and user interactions.
   - Implement server-side streaming using the SDK's StreamData or StreamText for efficient response handling of the AI Assistant's Message.

9. Enhanced user experience:
    - Implement markdown rendering for AI responses to support formatted text, code blocks, and lists.
    - Add a copy-to-clipboard feature for individual messages.

Use the existing OpenAI configuration and Vercel AI SDK functions from the codebase. Implement the AI assistant functionality in new page components for the interface. Create all necessary components for the user interface and AI interactions, including but not limited to:
- MessageList component to display messages
- InputField component for user input
- ErrorDisplay component for showing error messages
- LoadingIndicator component for asynchronous operations

Update the existing API route to support OpenAI gpt-4o, ensuring proper error handling and response formatting.

Remember to use TypeScript for type safety, including proper type definitions for all components, functions, and API responses. Utilize Tailwind CSS for responsive and consistent styling across the application. Leverage Next.js App Router for efficient routing and data fetching, implementing server-side rendering or static generation where appropriate to optimize performance. Use React to make a robust interactivity with the Vercel SDK.