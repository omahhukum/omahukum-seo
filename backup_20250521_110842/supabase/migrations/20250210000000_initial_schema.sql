-- Create tables for the application

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    komentar TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create artikel table
CREATE TABLE IF NOT EXISTS public.artikel (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    konten TEXT NOT NULL,
    gambar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create konsultasi table
CREATE TABLE IF NOT EXISTS public.konsultasi (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telepon VARCHAR(20) NOT NULL,
    topik VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create buku_tamu table
CREATE TABLE IF NOT EXISTS public.buku_tamu (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telepon VARCHAR(20) NOT NULL,
    pesan TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artikel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.konsultasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buku_tamu ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.reviews
        FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'artikel' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.artikel
        FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'konsultasi' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.konsultasi
        FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'buku_tamu' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.buku_tamu
        FOR SELECT USING (true);
    END IF;
END $$;

-- Allow authenticated users to insert into all tables
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Enable insert for authenticated users') THEN
        CREATE POLICY "Enable insert for authenticated users" ON public.reviews
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'artikel' AND policyname = 'Enable insert for authenticated users') THEN
        CREATE POLICY "Enable insert for authenticated users" ON public.artikel
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'konsultasi' AND policyname = 'Enable insert for authenticated users') THEN
        CREATE POLICY "Enable insert for authenticated users" ON public.konsultasi
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'buku_tamu' AND policyname = 'Enable insert for authenticated users') THEN
        CREATE POLICY "Enable insert for authenticated users" ON public.buku_tamu
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
END $$;

-- Allow admin users to update and delete
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Enable all access for admin users') THEN
        CREATE POLICY "Enable all access for admin users" ON public.reviews
        FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'artikel' AND policyname = 'Enable all access for admin users') THEN
        CREATE POLICY "Enable all access for admin users" ON public.artikel
        FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'konsultasi' AND policyname = 'Enable all access for admin users') THEN
        CREATE POLICY "Enable all access for admin users" ON public.konsultasi
        FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'buku_tamu' AND policyname = 'Enable all access for admin users') THEN
        CREATE POLICY "Enable all access for admin users" ON public.buku_tamu
        FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'));
    END IF;
END $$; 