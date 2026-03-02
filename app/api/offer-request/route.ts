import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      rooms,
      heatingType,
      blinds,
      priority,
      message,
      lang,
    } = body || {};

    if (!name || !email) {
      return NextResponse.json(
        {
          error:
            lang === "en"
              ? "Name and email are required."
              : "Numele și emailul sunt obligatorii.",
        },
        { status: 400 }
      );
    }

    const to = "office@smarthomemall.ro";
    const subject =
      lang === "en"
        ? "New simple smart home offer request"
        : "Cerere ofertă simplă Smart Home";

    const html = `
      <h1>${subject}</h1>
      <p><strong>Nume / Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon / Phone:</strong> ${phone || "-"}</p>
      <p><strong>Limba formularului / Form language:</strong> ${lang || "ro"}</p>
      <hr />
      <p><strong>Număr de camere / Number of rooms:</strong> ${rooms || "-"}</p>
      <p><strong>Tip încălzire / Heating type:</strong> ${heatingType || "-"}</p>
      <p><strong>Rulouri / Jaluzele (Blinds / Shutters):</strong> ${
        blinds || "-"
      }</p>
      <p><strong>Ce contează cel mai mult (What matters most):</strong> ${
        priority || "-"
      }</p>
      <h2>Detalii suplimentare / Additional details</h2>
      <p>${(message || "").replace(/\n/g, "<br />") || "-"}</p>
    `;

    const result = await sendEmail(to, subject, html);

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            lang === "en"
              ? "Failed to send email."
              : "Nu am putut trimite emailul.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling offer request:", error);
    return NextResponse.json(
      {
        error:
          "A apărut o eroare la procesarea cererii. Vă rugăm să încercați din nou.",
      },
      { status: 500 }
    );
  }
}

