-- AlterTable
ALTER TABLE "payments" ADD COLUMN "stripe_checkout_session_id" TEXT,
ADD COLUMN "stripe_payment_intent_id" TEXT,
ADD COLUMN "paid_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripe_checkout_session_id_key" ON "payments"("stripe_checkout_session_id");
