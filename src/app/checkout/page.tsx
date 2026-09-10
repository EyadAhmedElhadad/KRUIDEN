import type { Metadata } from "next";
import { isPaymobConfigured } from "@/lib/paymob";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout — Kruiden",
};

export default function CheckoutPage() {
  return (
    <div className="container-editorial max-w-2xl py-12 md:py-16">
      <h1 className="font-serif text-3xl font-semibold text-ink md:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-ink/50">
        A few details and you're done — most orders ship within 24 hours.
      </p>
      <div className="mt-10">
        <CheckoutForm paymobEnabled={isPaymobConfigured()} />
      </div>
    </div>
  );
}
