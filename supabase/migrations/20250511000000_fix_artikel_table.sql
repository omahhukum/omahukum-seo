-- Backup data artikel yang ada (jika ada)
CREATE TABLE IF NOT EXISTS public.artikel_backup AS 
SELECT * FROM public.artikel;

-- Drop tabel artikel jika sudah ada
DROP TABLE IF EXISTS public.artikel;

-- Buat ulang tabel artikel dengan struktur yang benar
CREATE TABLE IF NOT EXISTS public.artikel (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    penulis VARCHAR(255) NOT NULL,
    sumber VARCHAR(255),
    isi TEXT NOT NULL,
    kategori VARCHAR(100),
    gambar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.artikel ENABLE ROW LEVEL SECURITY;

-- Policy untuk select (semua orang bisa baca)
CREATE POLICY "Enable read access for all users" ON public.artikel
    FOR SELECT USING (true);

-- Policy untuk insert (hanya admin)
CREATE POLICY "Enable insert for admin only" ON public.artikel
    FOR INSERT WITH CHECK (auth.email() = 'omahhukum.jatim@gmail.com');

-- Policy untuk update (hanya admin)
CREATE POLICY "Enable update for admin only" ON public.artikel
    FOR UPDATE USING (auth.email() = 'omahhukum.jatim@gmail.com');

-- Policy untuk delete (hanya admin)
CREATE POLICY "Enable delete for admin only" ON public.artikel
    FOR DELETE USING (auth.email() = 'omahhukum.jatim@gmail.com');

-- Buat trigger untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_artikel_updated_at
    BEFORE UPDATE ON artikel
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Restore data dari backup (jika ada)
INSERT INTO public.artikel (
    id, judul, penulis, sumber, isi, kategori, gambar, created_at, updated_at
)
SELECT 
    id, judul, penulis, sumber, isi, kategori, gambar, created_at, updated_at
FROM public.artikel_backup;

-- Drop tabel backup
DROP TABLE IF EXISTS public.artikel_backup; 