'use server';

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/gemini-ai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
// import { generateSummaryFromOpenAI } from "@/lib/openai";
import { error } from "console";

interface pdfSummaryType{ 
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}


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

    const formattedFileName = formatFileNameAsTitle(filename);

    return{
        success:true,
        message: 'Summary generated successfully',
        data:{
            title:formattedFileName,
            summary,
        },
    }

} catch(error){
    return {
        success: false,
        message: 'File upload failed',error,
        data: null,
    };
}
}

async function savePdfSummary({
  userId, fileUrl, summary, title, fileName
}: { 
  userId: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}) {
  try {
    const sql = await getDbConnection();

    // Insert query for saving the PDF summary
    const result = await sql`
      INSERT INTO pdf_summaries (
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name
      )
      VALUES (
        ${userId},
        ${fileUrl},
        ${summary},
        ${title},
        ${fileName}
      );`;


  } catch (error) {
    console.error('Error saving the PDF summary:', error);
    throw new Error('Failed to save PDF summary. Please try again later.');
  }
}


export async function storePdfSummaryAction({
            fileUrl,
            summary,
            title,
            fileName,
        }: pdfSummaryType) {

    // users is looged in and has a user id

    // save pdf summary

    // savePdfSummary()

    let savedSummary:any;
    try{
        const {userId} = await auth();

        if(!userId){
            return{
            success:false,
            message: 'user not found', 
        };
        }
        savedSummary = await savePdfSummary({
            userId,
            fileUrl,
            summary,
            title,
            fileName,
        });

        if(!savedSummary){
            return{
            success:false,
            message: 'Error saving pdf summary, please try again...', 
        };
        }

        return{
            success:true,
            messege:'PDF summary saved successfully'
        }

    } catch(error) {
        return{
            success:false,
            messege:error instanceof Error ? error.message: 'Error saving pdf summary', 
        }
    }
}