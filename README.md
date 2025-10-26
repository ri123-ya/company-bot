# company-bot
### Planning
#### Stage 1. Indexing
- Upload the document (eg - pdf, text) 
  `npm i @langchain/community @langchain/core pdf-parse`
   ``https://js.langchain.com/docs/integrations/document_loaders/file_loaders/pdf/``
- Chunk the document 
   `npm i @langchain/textsplitters`
   `import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";`
   ``https://js.langchain.com/docs/concepts/text_splitters/``
- generate vector embedding
  `import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";`
  ``https://ai.google.dev/gemini-api/docs/embeddings``
- store the vector embedding - Vector db
   `import { QdrantVectorStore } from "@langchain/qdrant";`
   ``https://cloud.qdrant.io/``

#### Stage 2. using the Chatbot
- Setup LLM
  --- using groq-sdk
- add retrivel step
- pass input + relevent info
