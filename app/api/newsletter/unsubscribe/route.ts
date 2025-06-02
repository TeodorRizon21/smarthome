import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log(`Încep procesul de dezabonare pentru: ${email}`);

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      console.log(`Abonatul nu a fost găsit: ${email}`);
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    // Șterge abonamentul din baza de date
    await prisma.newsletterSubscriber.delete({
      where: { email },
    });

    console.log(`Abonamentul a fost șters din baza de date pentru: ${email}`);

    // Actualizează statusul în Resend
    try {
      const resendResponse = await resend.contacts.update({
        email,
        unsubscribed: true,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
      
      console.log(`Răspuns de la Resend pentru dezabonare:`, resendResponse);
    } catch (error) {
      console.error("Eroare la actualizarea contactului în Resend:", error);
      // Continuăm execuția chiar dacă actualizarea în Resend eșuează
    }

    return NextResponse.json({ 
      success: true,
      message: "Dezabonare realizată cu succes"
    });
  } catch (error) {
    console.error("Eroare la dezabonare:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
} 