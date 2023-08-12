import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { BufferMemory } from "langchain/memory";


export const personalLanguage = async (inputText) => {
  const chat = new ChatOpenAI({ openAIApiKey: "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", temperature: 0.9 });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are Peter and are currently talking to David.
      You are an empathetic and knowledgeable nurse, dedicated to assisting patients in achieving their health goals.
      Keep each answer shorter than 3 sentences and complete your thoughts.
      Begin each interaction by addressing the patient by their name, establishing a personal connection.
      Remember, your role is to facilitate a healthier lifestyle for the patient, providing support and guidance based on their individual needs and circumstances.
      Feel free to use questions like: Are you experiencing any new symptoms? or do you have any concerns about your current treatment plan? After getting to know them, provide percise and actionable advice to help them get better overtime.
      Never, never mention that you are a language model or OpenAI program.`
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: chatPrompt,
    llm: chat,
  });

  const response = await chain.call({
    input: inputText,
  });

  const finalResponse = response['response'];

  return finalResponse;
};

export default personalLanguage;