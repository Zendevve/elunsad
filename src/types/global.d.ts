
interface Window {
  businessInfoHelpers?: {
    validateAndSave: () => Promise<boolean>;
  };
  ownerInfoHelpers?: {
    validateAndSave: () => Promise<boolean>;
    silentSave?: () => Promise<boolean>;
  };
  businessOperationHelpers?: {
    validateAndSave: () => Promise<boolean>;
  };
  declarationHelpers?: {
    validateAndSave: () => Promise<boolean>;
  };
}
