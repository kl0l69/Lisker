export interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  folderId: string | null;
  createdAt: string; // ISO string
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string; // ISO string
}
