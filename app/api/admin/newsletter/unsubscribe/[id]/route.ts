import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: params.id },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    // Dezactivează abonamentul în baza de date
    await prisma.newsletterSubscriber.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    // Actualizează statusul în Resend
    try {
      await resend.contacts.update({
        email: subscriber.email,
        unsubscribed: true,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    } catch (error) {
      console.error("Error updating contact in Resend:", error);
      // Continuăm execuția chiar dacă actualizarea în Resend eșuează
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
} 