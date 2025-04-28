// /app/api/newsletter/route.js
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { randomBytes } from 'crypto'

const store = new Map()

export async function POST(request) {
  const { email } = await request.json()
  const token = randomBytes(16).toString('hex')
  store.set(token, email)

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/newsletter?token=${token}`
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verifica il tuo indirizzo email',
    html: `Clicca <a href="${verifyUrl}">qui</a> per confermare la tua email.`
  })

  return NextResponse.json({ ok: true })
}

export async function GET(request) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token || !store.has(token)) {
      return new NextResponse('Token non valido', { status: 400 });
    }
  
    // rimuovi il token e imposta il cookie
    const email = store.get(token);
    store.delete(token);
  
    const res = NextResponse.redirect(new URL('/verifica-newsletter', request.url));
    res.cookies.set('newsletterVerified', '1', { path: '/', httpOnly: true });
    return res;
  }