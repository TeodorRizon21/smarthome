import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 150,
    fontWeight: "bold",
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  tableCell: {
    flex: 1,
  },
  total: {
    marginTop: 20,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 10,
  },
  invoiceInfo: {
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
  },
});

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  product: {
    name: string;
  };
}

interface OrderDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  isCompany: boolean;
  companyName?: string;
  companyCUI?: string;
  companyRegNumber?: string;
  companyAddress?: string;
  companyCity?: string;
  companyCounty?: string;
}

interface BundleOrder {
  id: string;
  bundleId: string;
  quantity: number;
  price: number;
  bundle: {
    name: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  createdAt: Date;
  items: OrderItem[];
  details: OrderDetails;
  BundleOrder: BundleOrder[];
}

interface InvoicePDFProps {
  order: Order;
}

export const InvoicePDF = ({ order }: InvoicePDFProps) => {
  const formatDate = (date: Date) => {
    return format(new Date(date), "dd MMMM yyyy", { locale: ro });
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} RON`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Factura</Text>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>FACTURĂ</Text>
            <Text>Nr. {order.orderNumber}</Text>
            <Text>Data: {format(new Date(order.createdAt), "dd/MM/yyyy")}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date furnizor</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nume firma:</Text>
            <Text style={styles.value}>SmartHomeMall SRL</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CUI:</Text>
            <Text style={styles.value}>RO12345678</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reg. Com.:</Text>
            <Text style={styles.value}>J40/123/2023</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresa:</Text>
            <Text style={styles.value}>
              Strada Exemplu, Nr. 123, Bucuresti, Romania
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date cumparator</Text>
          {order.details.isCompany ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Nume firma:</Text>
                <Text style={styles.value}>{order.details.companyName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>CUI:</Text>
                <Text style={styles.value}>{order.details.companyCUI}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Reg. Com.:</Text>
                <Text style={styles.value}>
                  {order.details.companyRegNumber}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Adresa:</Text>
                <Text style={styles.value}>
                  {order.details.companyAddress}, {order.details.companyCity},{" "}
                  {order.details.companyCounty}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Nume:</Text>
                <Text style={styles.value}>{order.details.fullName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Adresa:</Text>
                <Text style={styles.value}>
                  {order.details.street}, {order.details.city},{" "}
                  {order.details.county}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Produs</Text>
            <Text style={styles.tableCell}>Cantitate</Text>
            <Text style={styles.tableCell}>Pret</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          {order.items.map((item: any) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {item.product?.name || `Produs ${item.productId}`}
                {item.size ? ` (${item.size})` : ""}
              </Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{formatPrice(item.price)}</Text>
              <Text style={styles.tableCell}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.total}>
          <Text>Total: {formatPrice(order.total)}</Text>
        </View>

        <View style={styles.footer}>
          <Text>SmartHomeMall SRL</Text>
          <Text>Strada Exemplu, Nr. 123, Bucuresti, Romania</Text>
          <Text>Tel: +40 123 456 789</Text>
          <Text>Email: contact@smarthomemall.ro</Text>
        </View>
      </Page>
    </Document>
  );
};
