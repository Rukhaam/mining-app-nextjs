import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import PrintableReceipt from "@/components/features/PrintableReceipt";
import { db } from "@/db";
import { dispatches } from "@/db/schema";
import { requireAdminSession } from "@/lib/session";

function serializeDispatch(record) {
  return {
    ...record,
    valid_from: record.valid_from?.toISOString() || null,
    valid_upto: record.valid_upto?.toISOString() || null,
    created_at: record.created_at?.toISOString() || null,
  };
}

export default async function PrintableReceiptPage({ params }) {
  await requireAdminSession();

  const { qrId } = await params;
  const [dispatchRecord] = await db
    .select()
    .from(dispatches)
    .where(eq(dispatches.qr_id, qrId))
    .limit(1);

  if (!dispatchRecord) {
    notFound();
  }

  return (
    <PrintableReceipt
      dispatchData={serializeDispatch(dispatchRecord)}
      qrId={dispatchRecord.qr_id}
      backHref="/admin/dashboard"
    />
  );
}
