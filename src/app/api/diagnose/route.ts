import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isPaymobConfigured } from "@/lib/paymob";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      has_database_url: !!process.env.DATABASE_URL,
      has_direct_url: !!process.env.DIRECT_URL,
      has_paymob_api_key: !!process.env.PAYMOB_API_KEY,
      has_paymob_integration_id: !!process.env.PAYMOB_INTEGRATION_ID,
      has_paymob_hmac_secret: !!process.env.PAYMOB_HMAC_SECRET,
      has_paymob_iframe_id: !!process.env.PAYMOB_IFRAME_ID,
    },
    database: {
      connection: "untested",
      tables: {},
      error: null,
    },
    paymob: {
      configured: isPaymobConfigured(),
      auth_test: "untested",
      auth_status: null,
      auth_error: null,
    }
  };

  // Test Database Connection and Tables
  try {
    const productsCount = await prisma.product.count().catch(() => -1);
    const ordersCount = await prisma.order.count().catch(() => -1);
    
    if (productsCount === -1 || ordersCount === -1) {
      diagnostics.database.connection = "failed_to_query_tables";
      diagnostics.database.error = "Database tables are missing. Please run 'npx prisma db push' with production DATABASE_URL.";
    } else {
      diagnostics.database.connection = "successful";
      diagnostics.database.tables = {
        product_count: productsCount,
        order_count: ordersCount,
      };
    }
  } catch (err: any) {
    diagnostics.database.connection = "failed_to_connect";
    diagnostics.database.error = err?.message || String(err);
  }

  // Test Paymob Auth Step
  if (isPaymobConfigured()) {
    try {
      const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
      });
      diagnostics.paymob.auth_status = authRes.status;
      if (authRes.ok) {
        diagnostics.paymob.auth_test = "successful";
      } else {
        const detail = await authRes.text().catch(() => "");
        diagnostics.paymob.auth_test = `failed_with_status_${authRes.status}`;
        diagnostics.paymob.auth_error = detail;
      }
    } catch (err: any) {
      diagnostics.paymob.auth_test = "error_fetching";
      diagnostics.paymob.auth_error = err?.message || String(err);
    }
  }

  return NextResponse.json(diagnostics);
}
