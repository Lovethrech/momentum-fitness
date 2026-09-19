import{book}from'../utils/store.js'
export default defineEventHandler(async event=>{const body=await readBody(event);if(!body?.name||!body?.email||!body?.slot)throw createError({statusCode:400,statusMessage:'Name, email and a session time are required.'});return{booking:await book(body)}})
