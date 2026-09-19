import pg from 'pg'
const { Pool } = pg
let pool
const programs=[{id:1,name:'Reset',weeks:4,level:'Beginner',price:89,accent:'lime',summary:'Build a routine that fits real life.'},{id:2,name:'Momentum',weeks:8,level:'All levels',price:149,accent:'blue',summary:'Strength, energy, and weekly coaching.'},{id:3,name:'Performance',weeks:12,level:'Intermediate',price:229,accent:'violet',summary:'Structured progression for a clear goal.'}]
const slots=['Mon · 8:00 AM','Mon · 5:30 PM','Tue · 7:00 AM','Wed · 6:00 PM','Thu · 12:30 PM','Fri · 9:00 AM']
function db(){if(!process.env.DATABASE_URL)return null;if(!pool)pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:false});return pool}
export async function getPrograms(){const client=db();if(!client)return {programs,slots};const [p,s]=await Promise.all([client.query('SELECT id,name,weeks,level,price::float,accent,summary FROM programs WHERE active=true ORDER BY id'),client.query("SELECT to_char(starts_at, 'Dy · HH12:MI AM') AS label FROM booking_slots WHERE booked=false AND starts_at>NOW() ORDER BY starts_at LIMIT 8")]);return{programs:p.rows,slots:s.rows.map(r=>r.label)}}
export async function book(body){const client=db();if(!client)return{id:`FIT-${Date.now().toString().slice(-5)}`,...body};const {rows}=await client.query('INSERT INTO bookings(name,email,program_id,slot_label,goal) VALUES($1,$2,$3,$4,$5) RETURNING id',[body.name,body.email,body.programId,body.slot,body.goal]);return{...rows[0],...body}}
