import Hero from "@/components/home/Hero";
import FeatureStrip from "@/components/home/FeatureStrip";
import WhyBrand from "@/components/home/WhyBrand";
import ProductShowcase from "@/components/home/ProductShowcase";
import ProductPurchase from "@/components/home/ProductPurchase";
import Benefits from "@/components/home/Benefits";
import SocialProof from "@/components/home/SocialProof";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import { getPrimaryProduct } from "@/lib/product";

export default async function HomePage() {
  const product = await getPrimaryProduct();

  return (
    <>
      <Hero product={product} />
      <FeatureStrip />
      <WhyBrand product={product} />
      <ProductShowcase product={product} />
      <ProductPurchase product={product} />
      <Benefits product={product} />
      <SocialProof />
      <FAQ />
      <FinalCTA />
    </>
  );
}
