export interface BankDetails {
  accountHolder?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
}

export interface VendorDocuments {
  registrationCertificate?: string | Blob;
  panCard?: string | Blob;
  bankProof?: string | Blob;
  ownerIdProof?: string | Blob;
}

export default interface VendorProfile {
  id: string;
  ownerName: string;
  email: string;
  logo?: string;
  phone?: number;
  companyName?: string;
  role: string;
  bankDetails?: BankDetails;
  documents?: VendorDocuments;
  isApproved: boolean;
  isBlocked: boolean;
  createdAt: string;
}