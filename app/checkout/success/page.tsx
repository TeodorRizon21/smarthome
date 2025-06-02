import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import SuccessContent from "@/components/SuccessContent";
import ErrorDisplay from "@/components/ErrorDisplay";
import { sendAdminNotification, sendOrderConfirmation } from "@/lib/email";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; order_id?: string };
}) {
  const sessionId = searchParams.session_id;
  const orderId = searchParams.order_id;

  if (!sessionId && !orderId) {
    redirect("/");
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

      const existingOrder = await prisma.order.findFirst({
        where: {
          paymentType: "card",
          paymentStatus: "COMPLETED",
          detailsId: session.metadata.detailsId,
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000), // Ultimele 5 minute
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
          order = await prisma.$transaction(async (prisma) => {
            console.log("Creating order...");
            // Create the order first
            const newOrder = await prisma.order.create({
              data: {
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
                          size: item.size,
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

            // Update stock for each regular item
            if (parsedRegularItems.length > 0) {
              console.log("Updating regular products stock...");
              for (const item of parsedRegularItems) {
                try {
                  const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    include: {
                      sizeVariants: true,
                    },
                  });

                  if (product) {
                    console.log(`Updating stock for product: ${product.id}`);
                    // Find the size variant
                    const sizeVariant = product.sizeVariants.find(
                      (v) => v.size === item.size
                    );

                    if (sizeVariant) {
                      // Update the stock for the size variant
                      await prisma.sizeVariant.updateMany({
                        where: {
                          productId: item.productId,
                          size: item.size,
                        },
                        data: {
                          stock: {
                            decrement: item.quantity,
                          },
                        },
                      });
                    } else {
                      console.log(
                        `Size variant not found for product ${product.id}, size ${item.size}`
                      );
                    }
                  } else {
                    console.log(`Product ${item.productId} not found`);
                  }
                } catch (itemError) {
                  console.error(
                    `Error processing regular item ${item.productId}:`,
                    itemError
                  );
                  // Continue processing other items
                }
              }
            }

            // Update stock for each bundle
            if (parsedBundleItems.length > 0) {
              console.log("Updating bundle products stock...");
              for (const bundleItem of parsedBundleItems) {
                try {
                  // Get the bundle with its items
                  const bundle = await prisma.bundle.findUnique({
                    where: { id: bundleItem.bundleId },
                    include: {
                      items: {
                        include: {
                          product: {
                            include: {
                              sizeVariants: true,
                            },
                          },
                        },
                      },
                    },
                  });

                  if (bundle) {
                    console.log(`Processing bundle: ${bundle.id}`);

                    // Update bundle stock
                    await prisma.bundle.update({
                      where: { id: bundle.id },
                      data: {
                        stock: {
                          decrement: bundleItem.quantity,
                        },
                      },
                    });
                  } else {
                    console.log(`Bundle ${bundleItem.bundleId} not found`);
                  }
                } catch (bundleError) {
                  console.error(
                    `Error processing bundle ${bundleItem.bundleId}:`,
                    bundleError
                  );
                  // Continue processing other bundles
                }
              }
            }

            // Nu mai actualizăm statusul comenzii, păstrăm originalul "Comanda este in curs de procesare"
            return newOrder;
          });
        } catch (txError) {
          console.error("Transaction error:", txError);
          throw txError;
        }

        // Send emails only after successful order creation
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

        // Verifică dacă stocul a fost deja actualizat
        // În loc să verificăm statusul comenzii, folosim un identificator intern mai precis
        // De exemplu, putem verifica dacă comanda are un anumit câmp populat (courier, awb)
        // sau putem verifica cât timp a trecut de la crearea comenzii
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        if (existingOrder.createdAt < thirtyMinutesAgo) {
          console.log("Order already processed, skipping stock updates");
          order = existingOrder;
        } else {
          order = await prisma.$transaction(async (prisma) => {
            console.log("Updating stock...");
            for (const item of existingOrder.items) {
              try {
                // Verifică dacă este un produs normal, nu un pachet
                const product = await prisma.product.findUnique({
                  where: { id: item.productId },
                  include: {
                    sizeVariants: true,
                  },
                });

                if (product) {
                  console.log(`Updating stock for product: ${product.id}`);
                  // Verifică dacă există varianta de mărime
                  const sizeVariant = product.sizeVariants.find(
                    (v) => v.size === item.size
                  );

                  if (sizeVariant) {
                    // Actualizează stocul doar pentru produse normale
                    await prisma.sizeVariant.updateMany({
                      where: {
                        productId: item.productId,
                        size: item.size,
                      },
                      data: {
                        stock: {
                          decrement: item.quantity,
                        },
                      },
                    });
                  } else {
                    console.log(
                      `Size variant not found for product ${product.id}, size ${item.size}`
                    );
                  }
                } else {
                  console.log(
                    `Product ${item.productId} not found - might be a bundle`
                  );
                }
              } catch (itemError) {
                console.error(
                  `Error processing item ${item.productId}:`,
                  itemError
                );
                // Nu aruncăm eroarea pentru a permite continuarea procesării
              }
            }

            // Nu actualizăm statusul comenzii, păstrăm statusul original
            // Marcăm intern doar că am procesat această comandă
            const orderAge =
              new Date().getTime() -
              new Date(existingOrder.createdAt).getTime();
            console.log(`Comanda are vârsta de ${orderAge / 1000 / 60} minute`);

            return existingOrder;
          });

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
        }
      } catch (txError) {
        console.error("Transaction error:", txError);
        throw txError;
      }
    }

    if (!order) {
      throw new Error("Failed to create or find order");
    }

    const userId = order.details.userId;
    if (!userId) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Comandă plasată cu succes!
            </h1>
            <p className="mb-4">
              Vă mulțumim pentru comandă! Am trimis un email de confirmare la
              adresa {order.details.email}.
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
      <SuccessContent orderId={order.id} paymentType={order.paymentType} />
    );
  } catch (error: any) {
    console.error("Error processing order:", error);
    return <ErrorDisplay message={error.message || "Eroare necunoscută"} />;
  }
}
