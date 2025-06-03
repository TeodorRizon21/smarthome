import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export async function POST(request: Request) {
  try {
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriberIds, subject, content } = await request.json();

    // Obține emailurile abonaților selectați
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        id: { in: subscriberIds },
        isActive: true,
      },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers found" },
        { status: 400 }
      );
    }

    // Trimite email-ul către fiecare abonat
    const emailPromises = subscribers.map(async (subscriber: NewsletterSubscriber) => {
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/newsletter/unsubscribe?email=${encodeURIComponent(
        subscriber.email
      )}`;

      const htmlContent = `
        ${content}
        <br><br>
        <p style="font-size: 12px; color: #666;">
          Pentru a te dezabona de la newsletter, click <a href="${unsubscribeUrl}">aici</a>.
        </p>
      `;

      return resend.emails.send({
        from: "SmartHomeMall <onboarding@resend.dev>",
        to: subscriber.email,
        subject,
        html: htmlContent,
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
} 