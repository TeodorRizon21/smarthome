import { prisma } from "@/lib/prisma";
import { ImageResponse } from "next/og";

export const alt = "Bundle Image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const bundle = await prisma.bundle.findUnique({
    where: { id: params.id },
  });

  if (!bundle) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            fontSize: 64,
            background: "white",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <div>Bundle negăsit</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 64,
          background: "white",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{bundle.name}</div>
          <div style={{ fontSize: 36, color: "#666", marginTop: 16 }}>
            Smart Home Bundle
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
