import { Suspense } from "react";
import UnsubscribeContent from "../../../components/UnsubscribeContent";

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-6 py-12 text-center">Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
