
export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  timestamp: number;
}

export interface DetectedItem {
  name: string;
  brand?: string;
  category: string;
  description: string;
  attributes?: string[];
  confidence: number;
}

export interface GeminiResponse {
  items: DetectedItem[];
}
