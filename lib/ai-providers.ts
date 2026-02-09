import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIResponse {
    content: string;
    provider: 'openai' | 'gemini';
}

/**
 * Generate AI response using OpenAI
 */
export async function generateOpenAIResponse(
    messages: AIMessage[],
    systemPrompt?: string
): Promise<string> {
    try {
        const formattedMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

        if (systemPrompt) {
            formattedMessages.push({
                role: 'system',
                content: systemPrompt,
            });
        }

        formattedMessages.push(
            ...messages.map((msg) => ({
                role: msg.role as 'user' | 'assistant' | 'system',
                content: msg.content,
            }))
        );

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 1000,
        });

        return completion.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to generate response from OpenAI');
    }
}

/**
 * Generate AI response using Gemini
 */
export async function generateGeminiResponse(
    messages: AIMessage[],
    systemPrompt?: string
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        // Build conversation history for Gemini
        const history = messages.slice(0, -1).map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
            },
            systemInstruction: systemPrompt,
        });

        const lastMessage = messages[messages.length - 1];
        const result = await chat.sendMessage(lastMessage.content);
        const response = await result.response;

        return response.text() || 'No response generated';
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to generate response from Gemini');
    }
}

/**
 * Generate AI response using the specified provider
 */
export async function generateAIResponse(
    provider: 'openai' | 'gemini',
    messages: AIMessage[],
    systemPrompt?: string
): Promise<AIResponse> {
    let content: string;

    if (provider === 'openai') {
        content = await generateOpenAIResponse(messages, systemPrompt);
    } else {
        content = await generateGeminiResponse(messages, systemPrompt);
    }

    return {
        content,
        provider,
    };
}
