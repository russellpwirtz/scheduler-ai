import OpenAI from 'openai';

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_HOSTNAME,
    });
  }

  async createChatCompletion(messages: any[], model: string = 'chatgpt-4o-latest') {
    // console.log('Creating chat completion with messages:', messages);
    try {
      const completion = await this.client.chat.completions.create({
        messages,
        model,
      });
      console.log('Chat completion created successfully:', completion);
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate chat completion');
    }
  }
} 