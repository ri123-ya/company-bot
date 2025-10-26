import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";

dotenv.config();

export async function indexTheDocument(filePath) {
  console.log("🔄 Loading PDF...");
  const loader = new PDFLoader(filePath, { splitPages: false });
  const doc = await loader.load(); //load the document
    console.log("✅ PDF loaded");
//   console.log(doc[0].pageContent);

  //Chunking
    console.log("🔄 Chunking document...");
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  const texts = await textSplitter.splitText(doc[0].pageContent);
    console.log(`✅ Created ${texts.length} chunks`);
  //console.log(texts);

  //embedding
    console.log("🔄 Initializing embedding model...");
  const embeddingModel = new GoogleGenerativeAIEmbeddings({
    modelName: "text-embedding-004",
  });

  //converting texts back to document
  const documents = texts.map((chunks)=>{
     return {
       pageContent: chunks,
       metadata: doc[0].metadata
     }
  });
  
    console.log("🔄 Creating embeddings and storing in Qdrant...");
  const vectorStore = await QdrantVectorStore.fromDocuments(
    documents,
    embeddingModel,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: "company-bot",
    }
  );
  console.log("✅ All vectors stored in Qdrant successfully!");
  console.log(`📊 Collection: "company-bot" contains ${texts.length} vectors`);
  
  return vectorStore;

  

  
}
