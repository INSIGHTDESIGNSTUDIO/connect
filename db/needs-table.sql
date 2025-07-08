-- Create needs table
CREATE TABLE IF NOT EXISTS public.needs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    roles TEXT[], -- Array of role IDs
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.needs ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (same pattern as other tables)
CREATE POLICY "Authenticated users can read needs" 
    ON public.needs 
    FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Authenticated users can insert needs" 
    ON public.needs 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update needs" 
    ON public.needs 
    FOR UPDATE 
    TO authenticated 
    USING (true);

CREATE POLICY "Authenticated users can delete needs" 
    ON public.needs 
    FOR DELETE 
    TO authenticated 
    USING (true);

-- Insert initial sample data (optional)
INSERT INTO public.needs (name, description, icon, roles, "createdAt", "updatedAt")
VALUES 
    ('Teaching Resources', 'Materials and guides for classroom teaching', 'BookOpen', ARRAY['']::text[], now(), now()),
    ('Unit Development', 'Resources for developing and planning course units', 'FileText', ARRAY['']::text[], now(), now()),
    ('Student Support', 'Resources for helping students succeed', 'Users', ARRAY['']::text[], now(), now()),
    ('Professional Development', 'Resources for improving teaching skills', 'GraduationCap', ARRAY['']::text[], now(), now()),
    ('Technology', 'Tools and software for educational purposes', 'Computer', ARRAY['']::text[], now(), now()),
    ('Assessment', 'Tools and guides for student assessment', 'CheckCircle', ARRAY['']::text[], now(), now()),
    ('Feedback', 'Resources for providing and collecting feedback', 'MessageSquare', ARRAY['']::text[], now(), now());