export interface ConversionRequest {
    url: string;
}
  
export interface ConversionResponse {
    downloadUrl: string;
    error?: string;
}