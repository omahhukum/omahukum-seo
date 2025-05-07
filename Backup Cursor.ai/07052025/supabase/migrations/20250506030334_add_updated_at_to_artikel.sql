-- Tambahkan kolom updated_at jika belum ada
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'artikel' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE artikel ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Hapus trigger lama jika ada
DROP TRIGGER IF EXISTS update_artikel_updated_at ON artikel;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Buat fungsi untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Buat trigger baru
CREATE TRIGGER update_artikel_updated_at
    BEFORE UPDATE ON artikel
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
