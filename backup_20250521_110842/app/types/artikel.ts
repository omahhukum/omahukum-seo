export interface Artikel {
  id: string; // UUID
  judul: string;
  penulis: string;
  sumber: string;
  isi: string;
  kategori?: string;
  gambar?: string;
  created_at: string;
  updated_at: string;
} 