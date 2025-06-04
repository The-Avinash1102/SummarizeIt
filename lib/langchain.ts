import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function fetchAndExtractPdfText(fileurl:string) {
    const response = await fetch(fileurl);
    const blob = await response.blob();

    const arrayBuffer = await blob.arrayBuffer();

    const loader = new PDFLoader(new Blob([arrayBuffer]));

    const docs = await loader.load();

    // cobine all pages

    return docs.map((doc) => doc.pageContent).join('\n');
}