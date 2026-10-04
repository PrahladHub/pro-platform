import React, { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Start building your first website.",
    features: [
      "1 Website",
      "Basic Templates",
      "Basic Website Builder",
      "Platform Subdomain",
    ],
    button: "Current Plan",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹199",
    period: "/month",
    description: "For creators and small businesses.",
    features: [
      "10 Websites",
      "Premium Templates",
      "Advanced Website Builder",
      "Custom Domain",
      "Remove Platform Branding",
    ],
    button: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "₹499",
    period: "/month",
    description: "For growing businesses and teams.",
    features: [
      "Unlimited Websites",
      "All Templates",
      "Advanced Features",
      "Custom Domains",
      "Analytics",
      "Priority Support",
    ],
    button: "Choose Business",
    popular: false,
  },
];

function Billing() {
  const [selectedPlan, setSelectedPlan] = useState("Free");

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan.name);

    if (plan.name === "Free") {
      return;
    }

    alert(`${plan.name} plan selected. Payment integration will be connected later.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-400">
            Billing
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Choose the right plan for you
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Upgrade your Pro Platform account when you need more websites,
            custom domains and advanced features.
          </p>
        </div>

        {/* Current subscription */}
        <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Current subscription
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {selectedPlan}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Your account is currently using the {selectedPlan} plan.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 px-5 py-3">
              <p className="text-xs text-slate-400">
                Account status
              </p>

              <p className="mt-1 font-semibold text-green-400">
                Active
              </p>
            </div>

          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-6 lg:grid-cols-3">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.popular
                  ? "border-blue-500 bg-slate-900 shadow-lg shadow-blue-500/10"
                  : "border-slate-800 bg-slate-900"
              }`}
            >

              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute right-5 top-5 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold">
                  {plan.name}
                </h2>

                <p className="mt-2 min-h-[48px] text-sm text-slate-400">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mt-6">
                <span className="text-4xl font-bold">
                  {plan.price}
                </span>

                <span className="ml-1 text-sm text-slate-400">
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <div className="mt-6 flex-1">
                <p className="mb-4 text-sm font-semibold text-slate-300">
                  What's included:
                </p>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <span className="mt-0.5 text-green-400">
                        ✓
                      </span>

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button */}
              <button
                onClick={() => handlePlanSelect(plan)}
                disabled={plan.name === "Free"}
                className={`mt-8 w-full rounded-xl px-5 py-3 font-semibold transition ${
                  plan.name === "Free"
                    ? "cursor-not-allowed bg-slate-800 text-slate-500"
                    : plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                {selectedPlan === plan.name && plan.name !== "Free"
                  ? "Selected"
                  : plan.button}
              </button>

            </div>
          ))}

        </div>

        {/* Payment information */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">
            Payment & invoices
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Your payment gateway will be connected here. After integration,
            users will be able to securely upgrade their plans and view
            their payment history.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">
                Payment Status
              </p>
              <p className="mt-1 font-semibold">
                No active payment
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">
                Next Billing
              </p>
              <p className="mt-1 font-semibold">
                —
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">
                Payment History
              </p>
              <p className="mt-1 font-semibold">
                No payments yet
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Billing;