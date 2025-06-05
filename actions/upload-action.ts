'use server';

import { generateSummaryFromGemini } from "@/lib/gemini-ai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
// import { generateSummaryFromOpenAI } from "@/lib/openai";
import { error } from "console";



export async function generatePdfSummary(uploadResponse: [{
    serverData: {
        userId: string;
        file: {
            url: string;
            name: string;
        };
    };
}]) {
    if (!uploadResponse) {
        return {
            success: false,
            message: 'File upload failed',
            data: null,
        };
    }

    const { serverData: { userId, file: { url: pdfurl, name: filename } } } = uploadResponse[0];


    
    if(!pdfurl){
    return {
        success: false,
        message: 'File upload failed',
        data: null,
    };
}
try{
    const pdfText = await fetchAndExtractPdfText(pdfurl);
    console.log({pdfText});

    let summary;
    try{
        summary = await generateSummaryFromGemini(pdfText);
        console.log({summary});
    }catch(err){
        console.log(err);

        // gemini code
        
        if(error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED'){

                console.error('Gemini API failed');
                throw new Error('Failed to generate summary...!')
            
        }
    }

    if(!summary){
        return{
            success:false,
            message:'Failed to generate summary',
            data:null,
        };
    }

    return{
        success:true,
        message: 'Summary generated successfully',
        data:{
            summary,
        },
    }

} catch(err){
    return {
        success: false,
        message: 'File upload failed',
        data: null,
    };
}
}
