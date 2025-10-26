import Groq from 'groq-sdk';
import readline from 'node:readline/promises';
import dotenv from "dotenv";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat(){
    // Connect to existing Qdrant collection instead of re-indexing
    console.log("🔄 Connecting to Qdrant...");
    
    const embeddingModel = new GoogleGenerativeAIEmbeddings({
        modelName: "text-embedding-004",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddingModel,
        {
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
            collectionName: "company-bot",
        }
    );
    
    console.log("✅ Connected to Qdrant");
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });


    while(true){
        const question = await rl.question("You: ");

        if(question.toLowerCase() === "bye"){
            break;
        }
        
        //retrieval
        const relevantChunks = await vectorStore.similaritySearch(question,3);
        
        // Build context 
        const context = relevantChunks
            .map(chunk => chunk.pageContent)
            .join('\n\n');

        // console.log(context);

        const SYSTEM_PROMPT = `You are an assistant for question-answering tasks. Use the following relevant pieces of retrieved context from the pdf to answer the question in elaborate manner. If you don't know the answer, say I don't know.`;
        
        const userQuery = `Question: ${question}
        Relevant context: ${context}
        Answer:`;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: userQuery,
                },
            ],
            model: 'llama-3.3-70b-versatile',
        });
        console.log(`Assistant: ${completion.choices[0].message.content}`);

    }
    
    rl.close();
}
chat();
