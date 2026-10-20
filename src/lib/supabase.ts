import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gqvhziowlofocwptxhbo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxdmh6aW93bG9mb2N3cHR4aGJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMDI4MTEsImV4cCI6MjEwNzg3ODgxMX0.X0VP-R_IvO4Comhg-PKXalvmcoQRsgOpK856z1zixmg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)