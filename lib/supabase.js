import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hkpdupzswkbezbkvodoo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcGR1cHpzd2tiZXpia3ZvZG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODM5NDcsImV4cCI6MjA4OTk1OTk0N30.2NpRQmltBtJEcBfh1-zmdxwRUNLhFae0S-HYggsNBHY'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase