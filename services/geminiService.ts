
import { GoogleGenAI, Type } from "@google/genai";
import { Movie, MovieRecommendation } from '../types';

export const getMovieRecommendations = async (movies: Movie[]): Promise<MovieRecommendation[]> => {
  if (!process.env.VITE_GEMINI_API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

  const movieList = movies.map(movie => `- ${movie.title}`).join('\n');
  const prompt = `
    You are an expert film recommender. Analyze the user's favorite movies and identify underlying themes, tones, directorial styles, narrative structures, and emotional currents. Do not just match by genre, actors, or popularity.
Based on this analysis, generate **5 unique movie recommendations** the user will likely love but might not have discovered. 
Return the result as a JSON array of objects with this structure:

[
  {
    "title": "Movie Title",
    "reason": "2-3 sentence explanation connecting the recommendation to the user's taste.",
    "match_reasons": [
      "Brief bullet point connecting to a feature of a favorite movie.",
      "Another short bullet point highlighting a shared quality."
    ]
  }
]

User's favorite movies:
${movieList}

Return **only valid JSON**, do not include any explanation or extra text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "The title of the recommended movie."
              },
              reason: {
                type: Type.STRING,
                description: "A short, compelling paragraph explaining why the user will like this movie based on their favorites."
              },
              match_reasons: {
                type: Type.ARRAY,
                description: "A list of specific features matching the user's favorite movies.",
                items: {
                    type: Type.STRING
                }
              }
            },
            required: ["title", "reason", "match_reasons"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const recommendations: MovieRecommendation[] = JSON.parse(jsonText);
    return recommendations;

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get recommendations from Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching recommendations.");
  }
};