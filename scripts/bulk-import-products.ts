import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RawProduct = {
  cod: string;
  denumire: string;
  valoare: number;
};

// COMPLETEAZĂ LISTA CU TOATE PRODUSELE TALE.
// Exemplu de structură – păstrează exact câmpurile `cod`, `denumire`, `valoare`.
const PRODUCTS_TO_IMPORT: RawProduct[] = [
  { cod: "ADLD-04/03.1", denumire: "KNX LED Dimming Actuator 4-Fold, 4A, 4SU MDRC", valoare: 101.44 },
  { cod: "ADUD-01/02.3", denumire: "KNX Universal Dimming Actuator with Secure 1-Fold, 2SU MDRC", valoare: 98.72 },
  { cod: "ADUD-02/02.3", denumire: "KNX Universal Dimming Actuator with Secure 2-Fold, 4SU MDRC", valoare: 160.05 },
  { cod: "ADUD-04/02.3", denumire: "KNX Universal Dimming Actuator with Secure 4-Fold, 8SU MDRC", valoare: 189.79 },
  { cod: "ADUDF-01/01.1", denumire: "KNX Universal Dimming Actuator with Secure 1-Fold, Flush Mounted", valoare: 85.78 },
  { cod: "AMMA-04/06.S", denumire: "KNX Multifunctional Actuator 4-Fold with Secure, 6A, 2SU MDRC", valoare: 87.52 },
  { cod: "AMMA-08/10.S", denumire: "KNX Multifunctional Actuator 8-Fold with Secure, 10A, 4SU MDRC", valoare: 130.62 },
  { cod: "AMMA-16/10.S", denumire: "KNX Multifunctional Actuator 16-Fold with Secure, 10A, 12SU MDRC", valoare: 222.97 },
  { cod: "AMMAF-03/06.S", denumire: "KNX Multifunctional Actuator with Secure 3-Fold, 6A, Flush Mounted", valoare: 94.40 },
  { cod: "ARSA-04/16.S", denumire: "KNX Switch Actuator with Secure 4-Fold, 16A, 4SU MDRC", valoare: 111.35 },
  { cod: "ARSA-08/16.S", denumire: "KNX Switch Actuator with Secure 8-Fold, 16A, 8SU MDRC", valoare: 157.46 },
  { cod: "BNTP-USB/00.1", denumire: "KNX USB interface", valoare: 85.78 },
  { cod: "BTAI-06/05.1", denumire: "KNX Multifunctional Gateway,  6SU MDRC", valoare: 431.00 },
  { cod: "BTDG-01/64.1", denumire: "KNX/DALI Gateway 1-Fold, 4SU MDRC", valoare: 107.77 },
  { cod: "BTDG-02/64.1", denumire: "KNX/DALI Gateway 2-Fold, 4SU MDRC", valoare: 184.49 },
  { cod: "BTDG-02/64.2", denumire: "KNX DALI-2 Gateway 2-Fold with Secure, 4SU MDRC", valoare: 203.15 },
  { cod: "BTIL-01/00.2", denumire: "KNX IR Learner", valoare: 47.86 },
  { cod: "BTIRF-02/00.2", denumire: "KNX Gateway for IR, 2-Fold, Flush mounted", valoare: 72.85 },
  { cod: "BTMO-TY/00.3(Pole)", denumire: "KNX Gateway for Tuya ZigBee, Premium, 2SU MDRC", valoare: 121.97 },
  { cod: "CHPBD-06/55.1.00(White)", denumire: "KNX Push Button Sensor with Display, 3 gang, 55mm-  KNX Secure (for 1/3-gang button accessory )", valoare: 72.42 },
  { cod: "CHPBD-06/55.1.01(Black)", denumire: "KNX Push Button Sensor with Display, 3 gang, 55mm-  KNX Secure (for 1/3-gang button accessory )", valoare: 72.42 },
  { cod: "CHPBD-08/55.1.00(White)", denumire: "KNX Push Button Sensor with Display, 4 gang, 55mm-  KNX Secure (for 2/4-gang button accessory)", valoare: 81.04 },
  { cod: "CHPBD-08/55.1.01(Black)", denumire: "KNX Push Button Sensor with Display, 4 gang, 55mm-  KNX Secure (for 2/4-gang button accessory  )", valoare: 81.04 },
  { cod: "CHPBL-03/00.2.00(White)", denumire: "KNX Push Button Sensor with LCD & Secure, 55mm Matt Finish", valoare: 115.95 },
  { cod: "CHPBL-03/00.2.01(Black)", denumire: "KNX Push Button Sensor with LCD & Secure, 55mm Matt Finish", valoare: 115.95 },
  { cod: "CHPLE-08/02.1.00", denumire: "KNX Push Button Sensor Plus, 4-Gang, 55mm Shiny Finish", valoare: 62.94 },
  { cod: "CHPLE-08/02.2.03", denumire: "KNX Push Button Sensor Plus, 4-Gang, 55mm", valoare: 66.82 },
  { cod: "CHTB-04/01.2.21(Black)", denumire: "KNX Touch Button Slim, 4-Button", valoare: 59.07 },
  { cod: "CHTB-04/01.2.22(Silver)", denumire: "KNX Touch Button Slim, 4-Button", valoare: 59.07 },
  { cod: "CHTB-06/01.2.21(Black)", denumire: "KNX Touch Button Slim, 6-Button", valoare: 62.52 },
  { cod: "CHTB-06/01.2.22(Silver)", denumire: "KNX Touch Button Slim, 6-Button", valoare: 62.52 },
  { cod: "CHTF-3.3/3.1.01(Grey)", denumire: "KNX Smart Touch S3 with Secure (KNX+Intercom+App Server)", valoare: 215.21 },
  { cod: "CHTF-4.0/9.5.21(Black)", denumire: "KNX Smart Touch V40s black", valoare: 196.21 },
  { cod: "CHTF-4.0/9.5.22(White)", denumire: "KNX Smart Touch V40s white", valoare: 196.21 },
  { cod: "CHTF-5.0/15.5.22(White)", denumire: "KNX Smart Touch V50s", valoare: 288.48 },
  { cod: "CHTFB-3.0/6.1.21(Black)", denumire: "KNX Waltz Touch+ Pad - metal button", valoare: 258.18 },
  { cod: "CHTFB-3.0/6.1.22(Silver)", denumire: "KNX Waltz Touch+ Pad - metal button", valoare: 258.18 },
  { cod: "CHTI-10.1/120.2.23", denumire: "KNX Secure Smart Touch Z10 with Secure (KNX+ SIP Intercom+App Server)", valoare: 430.90 },
  { cod: "CHTI-13.3/120.2.23", denumire: "KNX Secure Smart Touch Z13 with Secure (KNX+ SIP Intercom+App Server)", valoare: 582.12 },
  { cod: "CHTI-7.0/120.1.22(White)", denumire: "KNX Smart Touch S7 wih secure (KNX+Intercom+App Server)  - white", valoare: 348.73 },
  { cod: "CHTI-7.0/120.1.23(Black)", denumire: "KNX Smart Touch S7 wih secure (KNX+Intercom+App Server)  - black", valoare: 333.23 },
  { cod: "CSAQI-06/00.1.00 (White)", denumire: "KNX Air Quality Sensor", valoare: 220.26 },
  { cod: "CSBP-04/00.1.00", denumire: "KNX Motion Sensor, PIR - KNX Secure", valoare: 64.24 },
  { cod: "CSBPM-04/00.1.00 (White)", denumire: "KNX Presence Sensor with Secure, Microwave", valoare: 111.64 },
  { cod: "CTBI-04/00.1", denumire: "KNX Binary Input 4-Fold, 2SU MDRC", valoare: 85.78 },
  { cod: "CTUI-04/04.1", denumire: "KNX Universal Interface 4-Fold, 12V DC", valoare: 42.69 },
  { cod: "CTUIF-06/04.1", denumire: "KNX Universal Interface with NTC Input & Secure, 4-Fold", valoare: 46.57 },

];

async function main() {
  console.log(`Încep importul pentru ${PRODUCTS_TO_IMPORT.length} produse...`);

  for (const row of PRODUCTS_TO_IMPORT) {
    const { cod, denumire, valoare } = row;

    if (!cod || !denumire || typeof valoare !== "number" || isNaN(valoare)) {
      console.warn(
        `Sari peste rând invalid: ${JSON.stringify(row, null, 2)}`
      );
      continue;
    }

    // Verifică dacă există deja un ColorVariant cu același cod de produs
    const existingVariant = await prisma.colorVariant.findUnique({
      where: { productCode: cod },
    });

    if (existingVariant) {
      console.log(
        `Produsul cu codul ${cod} există deja (productId=${existingVariant.productId}). Sari peste.`
      );
      continue;
    }

    try {
      const price = valoare;

      const product = await prisma.product.create({
        data: {
          name: denumire,
          description: `Descriere în curs de adăugare pentru produsul ${denumire}.`,
          // Poți schimba placeholder-ul dacă vrei altă imagine implicită
          images: ["/api/placeholder?width=250&height=250"],
          category: "Home and Building Control System",
          subcategory: null,
          pdfUrl: null,
          price,
          oldPrice: null,
          colorVariants: {
            create: {
              productCode: cod,
              color: "Standard",
              price,
              oldPrice: null,
            },
          },
        },
      });

      console.log(`Creat produs: ${cod} - ${denumire} (id=${product.id})`);
    } catch (error) {
      console.error(
        `Eroare la crearea produsului cu codul ${cod}:`,
        error
      );
    }
  }
}

main()
  .catch((err) => {
    console.error("Import întrerupt de o eroare neașteptată:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Conexiune Prisma închisă.");
  });

