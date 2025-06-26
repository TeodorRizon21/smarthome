import { prisma } from './prisma';

async function getLastOrderNumber(): Promise<string | null> {
  const lastOrder = await prisma.order.findFirst({
    orderBy: [
      {
        orderNumber: 'desc'
      }
    ]
  });
  return lastOrder?.orderNumber || null;
}

function incrementOrderNumber(currentNumber: string | null): string {
  if (!currentNumber) {
    return 'SHA0001';
  }

  // Extract the prefix and number parts
  const prefix = currentNumber.match(/[A-Z]+/)?.[0] || '';
  const number = parseInt(currentNumber.match(/\d+/)?.[0] || '0', 10);

  // If number reaches 9999, increment the prefix
  if (number >= 9999) {
    // Handle different prefix lengths
    if (prefix.length === 3) {
      if (prefix === 'SHZ') {
        return 'SHAA0001';
      }
      const lastChar = prefix.charAt(2);
      if (lastChar === 'Z') {
        const middleChar = prefix.charAt(1);
        if (middleChar === 'Z') {
          return 'SHAAA0001';
        }
        return `SH${String.fromCharCode(prefix.charCodeAt(1) + 1)}A0001`;
      }
      return `${prefix.slice(0, -1)}${String.fromCharCode(prefix.charCodeAt(2) + 1)}0001`;
    } else if (prefix.length === 4) {
      if (prefix === 'SHZZ') {
        return 'SHAAA0001';
      }
      const lastChar = prefix.charAt(3);
      if (lastChar === 'Z') {
        const secondLastChar = prefix.charAt(2);
        if (secondLastChar === 'Z') {
          return `SHA${String.fromCharCode(prefix.charCodeAt(1) + 1)}A0001`;
        }
        return `${prefix.slice(0, -2)}${String.fromCharCode(prefix.charCodeAt(2) + 1)}A0001`;
      }
      return `${prefix.slice(0, -1)}${String.fromCharCode(prefix.charCodeAt(3) + 1)}0001`;
    } else {
      // SHA -> SHB
      return `SH${String.fromCharCode(prefix.charCodeAt(2) + 1)}0001`;
    }
  }

  // Just increment the number
  return `${prefix}${(number + 1).toString().padStart(4, '0')}`;
}

export async function generateOrderNumber(): Promise<string> {
  const lastOrderNumber = await getLastOrderNumber();
  return incrementOrderNumber(lastOrderNumber);
} 