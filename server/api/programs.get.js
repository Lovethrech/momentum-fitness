import{getPrograms}from'../utils/store.js'
export default defineEventHandler(async()=>await getPrograms())
