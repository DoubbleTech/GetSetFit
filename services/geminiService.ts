
import { GoogleGenAI, Type } from "@google/genai";
import type { Job, Candidate } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const rankCandidates = async (job: Job, candidates: Candidate[]) => {
  const candidateResumes = candidates.map(c => `CANDIDATE_ID: ${c.id}\nRESUME:\n${c.resume}`).join('\n---\n');
  const prompt = `
    As an expert technical recruiter, your task is to analyze the following job description and a list of candidate resumes. 
    Based on the requirements in the job description, rank the candidates from best fit to worst fit.
    
    For each candidate provide:
    1. A relevance score from 0 to 100.
    2. A brief, one-sentence reasoning for each candidate's ranking, focusing on their most relevant skills, experience, and location.

    JOB DESCRIPTION:
    Title: ${job.title}
    Description: ${job.description}

    CANDIDATE RESUMES:
    ${candidateResumes}

    Return the ranking as a JSON array. Each object in the array should contain the candidate's ID (as a number), reasoning, and relevanceScore.
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
              relevanceScore: { type: Type.NUMBER },
            },
            required: ['candidateId', 'reasoning', 'relevanceScore'],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error ranking candidates:", error);
    throw new Error("Failed to get AI-powered candidate suggestions.");
  }
};

export const generateOfferLetterDraft = async (job: Job, candidate: Candidate) => {
  const prompt = `
    Generate a friendly and professional job offer confirmation message for a candidate.
    The message should be concise and easily editable.
    
    Company Name: (Implied, not specified)
    Job Title: ${job.title}
    Candidate Name: ${candidate.name}

    Create a draft that congratulates the candidate and confirms their selection for the role.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating offer letter:", error);
    throw new Error("Failed to generate an offer letter draft.");
  }
};

export const generateInterviewQuestions = async (job: Job, candidate: Candidate) => {
  const prompt = `
    You are a hiring manager interviewing ${candidate.name} for the position of ${job.title}.
    
    JOB DESCRIPTION:
    ${job.description}

    CANDIDATE RESUMES:
    ${candidate.resume}

    Generate a set of interview questions specifically tailored to this candidate.
    1. Identify 3 Technical Questions based on gaps or specific technologies mentioned in their resume versus the job requirements.
    2. Identify 2 Behavioral Questions based on their experience level.
    3. Provide a "Key signal to look for" for each question.

    Format the output as a structured JSON object with categories.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technicalQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  signal: { type: Type.STRING },
                }
              }
            },
            behavioralQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    signal: { type: Type.STRING },
                  }
                }
              }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating interview questions:", error);
    throw new Error("Failed to generate interview questions.");
  }
}

export const verifyCompanyIntegration = async (url: string) => {
  const prompt = `
    Verify if the following URL is a valid company page (like LinkedIn, Facebook, Website).
    URL: ${url}
    
    If it is valid, provide a summary starting with "Verified: [Company Name] - [Brief Description]".
    If it is not found or invalid, say "Error: Could not verify company details."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    return {
        text: response.text,
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error verifying company:", error);
    throw new Error("Failed to verify company page using AI.");
  }
};
