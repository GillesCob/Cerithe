export interface IDocument {
  id: string;
  title: string;
  type: string;
  url: string;
  createdAt: string;
  propertyId: string | null;
  roomId: string | null;
}
