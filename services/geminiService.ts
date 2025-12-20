import { GoogleGenAI, Type } from "@google/genai";
import type { Job, Candidate } from '../types';

/**
 * World-class senior engineer approach:
 * We do not initialize the AI client at the top level to avoid crashes 
 * when the API_KEY is missing in the browser environment.
 * Instead, we create an instance per-request or use a fallback.
 */

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const rankCandidates = async (job: Job, candidates: Candidate[]) => {
  const ai = getAIClient();

  // Fallback to Backend if no client-side key
  if (!ai) {
    try {
      const response = await fetch('/api/rank-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, candidates })
      });
      if (!response.ok) throw new Error('Backend request failed');
      return await response.json();
    } catch (error) {
      console.error("Ranking error:", error);
      return [];
    }
  }

  const candidateResumes = candidates.map(c => `CANDIDATE_ID: ${c.id}\nRESUME:\n${c.resume}`).join('\n---\n');
  const prompt = `
    Analyze the following job description and a list of candidate resumes. 
    Rank candidates from best fit to worst fit.
    Provide a brief, one-sentence reasoning for each ranking.

    JOB DESCRIPTION:
    Title: ${job.title}
    Description: ${job.description}

    CANDIDATE RESUMES:
    ${candidateResumes}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Client-side ranking error:", error);
    return [];
  }
};

export const generateOfferLetterDraft = async (job: Job, candidate: Candidate) => {
  const ai = getAIClient();

  if (!ai) {
    try {
      const response = await fetch('/api/generate-offer-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, candidate })
      });
      const data = await response.json();
      return data.offerLetter || "Failed to generate offer.";
    } catch (e) {
      return "Error connecting to backend.";
    }
  }

  const prompt = `Generate a job offer message for ${candidate.name} for the position of ${job.title} at Recruite Tree.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Offer draft generation failed.";
  } catch (error) {
    return "Drafting failed.";
  }
};

export const generateJobDescription = async (title: string, experience: string, location: string) => {
  const ai = getAIClient();

  if (!ai) {
    try {
      const response = await fetch('/api/generate-job-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, experience, location })
      });
      const data = await response.json();
      return data.description || "Failed to generate description.";
    } catch (e) {
      return "Backend connection error.";
    }
  }

  const prompt = `Write a 200-word job description for ${title} with ${experience} experience in ${location}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Description generation failed.";
  } catch (error) {
    return "Auto-write failed.";
  }
};