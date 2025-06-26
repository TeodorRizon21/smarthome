import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import SuccessContent from "@/components/SuccessContent";
import ErrorDisplay from "@/components/ErrorDisplay";
import { sendAdminNotification, sendOrderConfirmation } from "@/lib/email";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; order_id?: string };
}) {
  const sessionId = searchParams.session_id;
  const orderId = searchParams.order_id;

  console.log("CheckoutSuccessPage - searchParams:", searchParams);
  console.log("CheckoutSuccessPage - sessionId:", sessionId);
  console.log("CheckoutSuccessPage - orderId:", orderId);

  if (!sessionId && !orderId) {
    console.log("No session_id or order_id provided, redirecting to home");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Eroare: Informații lipsă
          </h1>
          <p className="mb-4">
            Nu s-au găsit informații despre comandă. Vă rugăm să verificați link-ul sau să încercați din nou.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Înapoi la pagina principală
            </a>
          </div>
        </div>
      </div>
    );
  }

  try {
    let order;

    if (sessionId) {
      console.log(`Processing checkout session: ${sessionId}`);
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
      });

      if (session.payment_status !== "paid") {
        throw new Error("Payment not successful");
      }

      // Verifică dacă există deja o comandă asociată cu această sesiune de checkout
      if (!session.metadata?.detailsId) {
        throw new Error("Missing order details ID in session metadata");
      }

      console.log(`Searching for existing order with detailsId: ${session.metadata.detailsId}`);

      const existingOrder = await prisma.order.findFirst({
        where: {
          paymentType: "card",
          paymentStatus: "COMPLETED",
          detailsId: session.metadata.detailsId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 60 * 1000), // Ultimele 30 minute
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          BundleOrder: {
            include: {
              bundle: true,
            },
          },
          details: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (existingOrder) {
        console.log(
          `Found existing order for session ${sessionId}: ${existingOrder.id}`
        );
        order = existingOrder;
      } else {
        console.log("No existing order found for session, searching for any recent order with same detailsId...");
        
        // Fallback: search for any recent order with the same detailsId
        const fallbackOrder = await prisma.order.findFirst({
          where: {
            detailsId: session.metadata.detailsId,
            createdAt: {
              gte: new Date(Date.now() - 30 * 60 * 1000), // Ultimele 30 minute
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
            BundleOrder: {
              include: {
                bundle: true,
              },
            },
            details: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (fallbackOrder) {
          console.log(`Found fallback order: ${fallbackOrder.id}`);
          order = fallbackOrder;
        } else {
          console.log("No existing order found, creating new one...");
          const {
            userId,
            detailsId,
            orderType,
            regularItems: regularItemsJson,
            bundleItems: bundleItemsJson,
            appliedDiscounts,
          } = session.metadata as {
            userId: string;
            detailsId: string;
            orderType: string;
            regularItems: string;
            bundleItems: string;
            appliedDiscounts: string;
          };

          let parsedRegularItems = [];
          let parsedBundleItems = [];

          if (regularItemsJson) {
            parsedRegularItems = JSON.parse(regularItemsJson);
            console.log(
              `Parsed regular items: ${JSON.stringify(parsedRegularItems)}`
            );
          }

          if (bundleItemsJson) {
            parsedBundleItems = JSON.parse(bundleItemsJson);
            console.log(
              `Parsed bundle items: ${JSON.stringify(parsedBundleItems)}`
            );
          }

          const parsedDiscounts = JSON.parse(appliedDiscounts || "[]");

          // Use a transaction to create order and update stock
          try {
            order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
              console.log("Creating order...");
              // Create the order first
              const newOrder = await tx.order.create({
                data: {
                  orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  userId,
                  total: session.amount_total! / 100,
                  paymentStatus: "COMPLETED",
                  orderStatus: "Comanda este in curs de procesare",
                  paymentType: "card",
                  orderType: orderType || "product",
                  details: { connect: { id: detailsId } },
                  items:
                    parsedRegularItems.length > 0
                      ? {
                          create: parsedRegularItems.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            color: item.color,
                            price: item.price,
                          })),
                        }
                      : undefined,
                  BundleOrder:
                    parsedBundleItems.length > 0
                      ? {
                          create: parsedBundleItems.map((item: any) => ({
                            bundleId: item.bundleId,
                            quantity: item.quantity,
                            price: item.price,
                          })),
                        }
                      : undefined,
                  discountCodes: {
                    create: parsedDiscounts.map((discount: any) => ({
                      discountCode: { connect: { code: discount.code } },
                    })),
                  },
                },
                include: {
                  items: {
                    include: {
                      product: true,
                    },
                  },
                  BundleOrder: {
                    include: {
                      bundle: true,
                    },
                  },
                  details: true,
                },
              });

              console.log("Order created: ", newOrder.id);
              return newOrder;
            });
          } catch (txError) {
            console.error("Transaction error:", txError);
            throw txError;
          }

          // Send emails only after successful order creation
          if (order) {
            try {
              console.log("Sending notification emails...");
              await Promise.all([
                sendAdminNotification(order),
                sendOrderConfirmation(order),
              ]);
            } catch (emailError) {
              console.error("Error sending emails:", emailError);
              // Don't throw the error as the order was still created successfully
            }
          }
        }
      }
    } else if (orderId) {
      console.log(`Processing order: ${orderId}`);
      // For cash on delivery orders
      try {
        // Verifică dacă comanda există deja și a fost procesată
        const existingOrder = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            items: {
              include: {
                product: true,
              },
            },
            details: true,
          },
        });

        if (!existingOrder) {
          throw new Error("Order not found");
        }

        console.log("Found existing order:", existingOrder.id);
        order = existingOrder;

        // Trimite e-mailurile doar dacă comanda tocmai a fost procesată
        try {
          console.log("Sending notification emails...");
          await Promise.all([
            sendAdminNotification(order),
            sendOrderConfirmation(order),
          ]);
        } catch (emailError) {
          console.error("Error sending emails:", emailError);
          // Don't throw the error as the order was still created successfully
        }
      } catch (txError) {
        console.error("Transaction error:", txError);
        throw txError;
      }
    } else {
      console.log("No session_id or order_id provided");
      throw new Error("No order information provided");
    }

    if (!order) {
      console.error("No order found or created");
      throw new Error("Failed to create or find order");
    }

    console.log(`Final order ID: ${order.id}`);

    // Get order details from the included relation
    const orderWithDetails = await prisma.order.findUnique({
      where: { id: order.id },
      include: { details: true }
    });

    if (!orderWithDetails?.details) {
      throw new Error("Order details not found");
    }

    const userId = orderWithDetails.details.userId;
    if (!userId) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Comandă plasată cu succes!
            </h1>
            <p className="mb-4">
              Vă mulțumim pentru comandă! Am trimis un email de confirmare la
              adresa {orderWithDetails.details.email}.
            </p>
            <p className="mb-4">
              Pentru a urmări comanda, vă rugăm să verificați email-ul pentru
              detalii.
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Înapoi la pagina principală
              </a>
            </div>
          </div>
        </div>
      );
    }

    return (
      <SuccessContent orderId={order.id} paymentType={order.paymentType} orderNumber={order.orderNumber} />
    );
  } catch (error: any) {
    console.error("Error processing order:", error);
    return <ErrorDisplay message={error.message || "Eroare necunoscută"} />;
  }
}
