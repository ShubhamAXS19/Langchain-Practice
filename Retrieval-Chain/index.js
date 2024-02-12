// Step 1 Load Documents

import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

const loader = new CheerioWebBaseLoader(
    "https://docs.smith.langchain.com/overview"
);

const docs = await loader.load();

console.log(docs.length);
console.log(docs[0].pageContent.length);


// Step 2 Split Documents
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const splitter = new RecursiveCharacterTextSplitter();

const splitDocs = await splitter.splitDocuments(docs);

console.log(splitDocs.length);
console.log(splitDocs[0].pageContent.length);

// Step 3 Create Embeddings

import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings();

// Step 4 Create Vector Store and give the embedded document to the vector store

import { MemoryVectorStore } from "langchain/vectorstores/memory";

const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
);

// Step 5 Create Retrieval Chain

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt =
    ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

<context>
{context}
</context>

Question: {input}`
    );

const documentChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt,
});

import { createRetrievalChain } from "langchain/chains/retrieval";

const retriever = vectorstore.asRetriever();

const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
});
// Step 6 Invoke the retrieval chain
import { ChatOpenAI } from "@langchain/openai";

const chatModel = new ChatOpenAI({
    openAIApiKey: "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",
});

const result = retrievalChain.pipe(chatModel)

const ans = await result.invoke({
    input: "what is LangSmith?",
});


console.log(ans.answer);

