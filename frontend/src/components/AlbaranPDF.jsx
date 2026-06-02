import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Dades de la serralleria
const SERRALLERIA = {
  name: "Serralleria Solidària",
  address: "Carrer Major 123",
  city: "08001 Barcelona",
  phone: "934 123 456",
  email: "info@serralleria.cat",
  nif: "B12345678"
};

export const generateAlbaranPDF = (order) => {
  try {
    const doc = new jsPDF();
    
    // Capçalera
    doc.setFontSize(20);
    doc.setTextColor(240, 112, 87);
    doc.text("ALBARÀ", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Núm. Comanda: #${order.id}`, 14, 30);
    doc.text(`Data: ${new Date(order.created_at).toLocaleDateString("ca-ES")}`, 14, 36);

    // Venedor
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("VENEDOR:", 14, 48);
    doc.setFont("helvetica", "normal");
    doc.text(SERRALLERIA.name, 14, 54);
    doc.text(SERRALLERIA.address, 14, 60);
    doc.text(SERRALLERIA.city, 14, 66);
    doc.text(`Tel: ${SERRALLERIA.phone}`, 14, 72);
    doc.text(`NIF: ${SERRALLERIA.nif}`, 14, 78);

    // Client
    doc.setFont("helvetica", "bold");
    doc.text("CLIENT:", 14, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`Nom: ${order.direction?.name || order.user?.name || "-"}`, 14, 96);
    doc.text(`Adreça: ${order.direction?.address || "-"}`, 14, 102);
    doc.text(`Ciutat: ${order.direction?.city || "-"}`, 14, 108);
    doc.text(`NIF: ${order.direction?.nif || "-"}`, 14, 114);

    // Taula de productes
    const tableColumn = ["Producte", "Qtat", "Preu", "Extra", "Subtotal"];
    const tableRows = [];

    order.details?.forEach((detail) => {
      const price = parseFloat(detail.product?.price) || 0;
      const subtotal = price * detail.quantity;
      tableRows.push([
        detail.product?.name || "-",
        detail.quantity.toString(),
        `${price.toFixed(2)}€`,
        (detail.extra_key || 0).toString(),
        `${subtotal.toFixed(2)}€`,
      ]);
    });

    const totalPrice = parseFloat(order.total_price) || 0;

    // Usar autoTable
    autoTable(doc, {
      startY: 125,
      head: [tableColumn],
      body: tableRows,
      foot: [["", "", "", "TOTAL:", `${totalPrice.toFixed(2)}€`]],
      theme: "striped",
      headStyles: {
        fillColor: [240, 112, 87],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      footStyles: {
        fillColor: [245, 245, 245],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      margin: { left: 14, right: 14 },
    });

    // Instal·lació
    if (order.install) {
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(240, 112, 87);
      doc.text("INSTAL·LACIÓ SOL·LICITADA", 14, finalY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("La instal·lació es realitzarà a l'adreça indicada pel client.", 14, finalY + 6);
    }

    // Guardar
    doc.save(`albarà_${order.id}.pdf`);
    
  } catch (error) {
    console.error("Error:", error);
    alert("Error en generar el PDF: " + error.message);
  }
};