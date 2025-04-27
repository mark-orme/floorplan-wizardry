
interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

interface BillingSettingsProps {
  currentPlan: BillingPlan;
  availablePlans: BillingPlan[];
  onPlanChange: (planId: string) => Promise<void>;
}

export const BillingSettings = ({
  currentPlan,
  availablePlans,
  onPlanChange
}: BillingSettingsProps): JSX.Element => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Current Plan</h2>
        <p className="text-sm text-muted-foreground">
          You are currently on the {currentPlan.name} plan.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availablePlans.map((plan) => (
          <div
            key={plan.id}
            className="relative rounded-lg border p-4"
          >
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ${plan.price}/{plan.interval}
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
