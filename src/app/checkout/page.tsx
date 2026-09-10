import type { Metadata } from "next";
import { isPaymobConfigured } from "@/lib/paymob";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getCartSettings } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout — Kruiden",
};

export default async function CheckoutPage() {
  const cartSettings = await getCartSettings();
  const paymobEnabled = isPaymobConfigured();
  // If COD disabled in settings, hide it even if paymob is off -> will show error in form
  return (
    <div className="container-editorial max-w-2xl py-12 md:py-16">
      <h1 className="font-serif text-3xl font-semibold text-ink md:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-ink/50">
        A few details and you're done — most orders ship within 24 hours.
      </p>
      {cartSettings.freeShippingThreshold ? (
        <p className="mt-2 text-xs text-olive-600">Free shipping over {(cartSettings.freeShippingThreshold / 100).toFixed(0)} {cartSettings.currency}</p>
      ) : null}
      <div className="mt-10">
        <CheckoutForm paymobEnabled={paymobEnabled} codEnabled={cartSettings.codEnabled} />
      </div>
    </div>
  );
}
