import { ChatOpenAI } from "@langchain/openai";

const chatModel = new ChatOpenAI({
  openAIApiKey: "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",
});

import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a world class technical documentation writer."],
  ["user", "{input}"],
]);

import { StringOutputParser } from "@langchain/core/output_parsers";

const outputParser = new StringOutputParser();

const llmChain = prompt.pipe(chatModel).pipe(outputParser);

const ans = await llmChain.invoke({
  input: "what is LangSmith?",
});

console.log(ans)