import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const env = fs.readFileSync('.env.local', 'utf8')
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1]
const SUPABASE_KEY = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1] || env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1]

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
async function go() {
  const { data, error } = await supabase.from('articles').insert({
    title: 'test', slug: 'test-slug', content: {}, published: true
  }).select()
  console.log('Result:', data, error)
}
go()
