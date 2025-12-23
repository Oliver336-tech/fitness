export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  focus: string;
}

export interface AnalysisResult {
  detected: boolean;
  message?: string; // For errors or "no person found"
  summary: string;
  targetAreas: string[];
  postureNotes: string[];
  routine: Exercise[];
  estimatedBodyFat?: string; // Range string e.g. "15-18%"
}

export interface UploadState {
  file: File | null;
  previewUrl: string | null;
  analyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  generatedImage: string | null;
  isGeneratingImage: boolean;
}
