
declare global {
  interface Window {
    businessInfoHelpers?: {
      validateAndSave: () => Promise<boolean>;
    };
    ownerInfoHelpers?: {
      validateAndSave: () => Promise<boolean>;
      silentSave: () => Promise<boolean>;
    };
    businessOperationHelpers?: {
      validateAndSave: () => Promise<boolean>;
    };
    declarationHelpers?: {
      validateAndSave: () => Promise<boolean>;
    };
    documentHelpers?: {
      validateDocuments: () => boolean;
      getCompletionStatus: () => {
        allUploaded: boolean;
        allApproved: boolean;
        missingDocuments: string[];
        pendingDocuments: string[];
        rejectedDocuments: string[];
      };
    };
  }
}

export {};
