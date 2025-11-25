
import { GoogleGenAI, Type } from "@google/genai";
import type { Job, Candidate } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const rankCandidates = async (job: Job, candidates: Candidate[]) => {
  const candidateResumes = candidates.map(c => `CANDIDATE_ID: ${c.id}\nRESUME:\n${c.resume}`).join('\n---\n');
  const prompt = `
    As an expert technical recruiter, your task is to analyze the following job description and a list of candidate resumes. 
    Based on the requirements in the job description, rank the candidates from best fit to worst fit.
    Provide a brief, one-sentence reasoning for each candidate's ranking, focusing on their most relevant skills, experience, and location.

    JOB DESCRIPTION:
    Title: ${job.title}
    Description: ${job.description}

    CANDIDATE RESUMES:
    ${candidateResumes}

    Return the ranking as a JSON array. Each object in the array should contain the candidate's ID (as a number) and your reasoning for their fit.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              candidateId: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
            },
            required: ['candidateId', 'reasoning'],
          },
        },
      },
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error ranking candidates:", error);
    return [];
  }
};

export const generateOfferLetterDraft = async (job: Job, candidate: Candidate) => {
  const prompt = `
    Generate a friendly and professional job offer confirmation message for a candidate.
    The message should be concise and easily editable.
    
    Company Name: AI Recruit
    Job Title: ${job.title}
    Candidate Name: ${candidate.name}

    Create a draft that congratulates the candidate and confirms their selection for the role.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating offer letter:", error);
    return "Dear Candidate, We are pleased to offer you the position. (AI generation failed)";
  }
};

export const generateJobDescription = async (title: string, experience: string, location: string) => {
    const prompt = `
      Write a professional, engaging, and structured job description for the following role:
      
      Job Title: ${title}
      Experience Level: ${experience}
      Location: ${location}
      
      Include the following sections:
      1. Role Overview
      2. Key Responsibilities
      3. Required Qualifications
      4. Why Join Us
      
      Keep it within 200 words, professional yet inviting.
    `;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "";
    } catch (error) {
      console.error("Error generating job description:", error);
      return "Failed to generate job description.";
    }
};
