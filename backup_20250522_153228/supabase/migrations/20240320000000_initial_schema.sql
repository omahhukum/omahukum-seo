-- Create tables for the application

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id BIGSERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    komentar TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create artikel table
CREATE TABLE IF NOT EXISTS public.artikel (
    id BIGSERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    konten TEXT NOT NULL,
    gambar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create konsultasi table
CREATE TABLE IF NOT EXISTS public.konsultasi (
    id BIGSERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    topik VARCHAR(255) NOT NULL,
    pesan TEXT NOT NULL,
    balasan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create buku_tamu table
CREATE TABLE IF NOT EXISTS public.buku_tamu (
    id BIGSERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nomor_telepon VARCHAR(20) NOT NULL,
    pesan TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.konsultasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buku_tamu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artikel ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    -- Reviews policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.reviews FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Enable insert for all users') THEN
        CREATE POLICY "Enable insert for all users" ON public.reviews FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Enable update for authenticated users only') THEN
        CREATE POLICY "Enable update for authenticated users only" ON public.reviews FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;

    -- Konsultasi policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'konsultasi' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.konsultasi FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'konsultasi' AND policyname = 'Enable insert for all users') THEN
        CREATE POLICY "Enable insert for all users" ON public.konsultasi FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'konsultasi' AND policyname = 'Enable update for authenticated users only') THEN
        CREATE POLICY "Enable update for authenticated users only" ON public.konsultasi FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;

    -- Buku Tamu policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'buku_tamu' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.buku_tamu FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'buku_tamu' AND policyname = 'Enable insert for all users') THEN
        CREATE POLICY "Enable insert for all users" ON public.buku_tamu FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'buku_tamu' AND policyname = 'Enable update for authenticated users only') THEN
        CREATE POLICY "Enable update for authenticated users only" ON public.buku_tamu FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;

    -- Artikel policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'artikel' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.artikel FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'artikel' AND policyname = 'Enable insert for authenticated users only') THEN
        CREATE POLICY "Enable insert for authenticated users only" ON public.artikel FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'artikel' AND policyname = 'Enable update for authenticated users only') THEN
        CREATE POLICY "Enable update for authenticated users only" ON public.artikel FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;
END $$; 