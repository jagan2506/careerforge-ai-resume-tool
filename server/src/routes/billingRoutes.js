// import express from "express";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import { stripe } from "../config/stripeClient.js";
// import { User } from "../models/User.js";

// dotenv.config();
// const router = express.Router();

// router.post("/create-checkout-session", async (req, res) => {
//   try {
//     const { priceId, userId, mode } = req.body;

//     const session = await stripe.checkout.sessions.create({
//       mode: mode || "subscription",
//       line_items: [
//         {
//           price: priceId,
//           quantity: 1
//         }
//       ],
//       success_url: `${process.env.CLIENT_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/billing/cancel`,
//       metadata: { userId }
//     });

//     res.json({ url: session.url });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Stripe session creation failed" });
//   }
// });

// router.post(
//   "/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error("Webhook signature verification failed.", err.message);
//       return res.sendStatus(400);
//     }

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const userId = session.metadata?.userId;
//       const subscriptionId = session.subscription;
//       const customerId = session.customer;

//       if (userId) {
//         await User.findByIdAndUpdate(userId, {
//           plan: "PRO",
//           stripeSubscriptionId: subscriptionId,
//           stripeCustomerId: customerId
//         });
//       }
//     }

//     if (event.type === "customer.subscription.deleted") {
//       const subscription = event.data.object;
//       const subId = subscription.id;
//       await User.findOneAndUpdate(
//         { stripeSubscriptionId: subId },
//         { plan: "FREE" }
//       );
//     }

//     res.json({ received: true });
//   }
// );

// export default router;
