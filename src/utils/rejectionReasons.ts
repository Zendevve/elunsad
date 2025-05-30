
export const COMMON_REJECTION_REASONS = [
  "Poor image quality - image is blurry or unclear",
  "Wrong document type uploaded",
  "Document appears to be incomplete or cut off",
  "Document is expired or outdated",
  "Missing required signature or stamp",
  "Document contains incorrect or inconsistent information",
  "File format not supported or corrupted",
  "Document is not legible or readable",
  "Missing required fields or sections",
  "Document does not match the required specifications",
  "Duplicate document already submitted",
  "Document appears to be altered or tampered with",
  "Other (specify in the text area below)"
];

export const formatSelectedReasons = (reasons: string[]): string => {
  if (reasons.length === 0) return '';
  if (reasons.length === 1) return reasons[0];
  
  // Format multiple reasons as a numbered list
  return reasons.map((reason, index) => `${index + 1}. ${reason}`).join('\n');
};
