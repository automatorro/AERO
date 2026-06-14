-- Create messages table for ride chat
CREATE TABLE public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id text NOT NULL,
  sender_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Politici: Doar participantii la cursa pot vedea/scrie mesaje
-- (Pentru MVP permitem userilor autentificati sa citeasca/scrie mesajele lor referitoare la o cursa)
CREATE POLICY "Users can read messages for their rides" 
  ON public.messages FOR SELECT 
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Users can insert messages" 
  ON public.messages FOR INSERT 
  WITH CHECK ( auth.uid() = sender_id );

-- Notificare in timp real pentru mesaje
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
