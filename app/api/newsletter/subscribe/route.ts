import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Verifică dacă emailul există deja
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: "Acest email este deja abonat" },
          { status: 400 }
        );
      } else {
        // Reactivăm abonamentul
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true },
        });
      }
    } else {
      // Creăm un nou abonat
      await prisma.newsletterSubscriber.create({
        data: { email },
      });
    }

    // Adăugăm contactul în Resend
    try {
      await resend.contacts.create({
        email,
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    } catch (error) {
      console.error("Error adding contact to Resend:", error);
      // Continuăm execuția chiar dacă adăugarea în Resend eșuează
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { error: "Failed to subscribe to newsletter" },
      { status: 500 }
    );
  }
} 