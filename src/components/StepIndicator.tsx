
type StepNumber = 1 | 2 | 3;

type Step = {
  label:string;
  step:StepNumber;
};

type StepIndicatorProps = {
 currentStep:StepNumber;
}

const steps : readonly Step[]= [
  { label: "購物車明細", step: 1 },
  { label: "付款資訊", step: 2 },
  { label: "結帳成功", step: 3 },
];


export default function StepIndicator({ currentStep }:StepIndicatorProps):JSX.Element {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      {steps.map((step) => (
        <div key={step.step} className="text-center flex-fill position-relative">
          {/* 圓圈 */}
          <div
            className={`rounded-circle mx-auto mb-2 ${step.step <= currentStep ? "bg-primary" : "bg-secondary"
              }`}
            style={{
              width: "32px",
              height: "32px",
              lineHeight: "32px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {step.step}
          </div>

          {/* 標籤 */}
          <div
            className={`${step.step === currentStep ? "fw-bold text-dark" : "text-muted"
              }`}
          >
            {step.label}
          </div>

        </div>
      ))}
    </div>
  );
}
