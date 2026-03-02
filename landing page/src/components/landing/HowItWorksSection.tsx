const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Connect your data",
      description: "Link inventory, sales, and supplier systems.",
    },
    {
      number: "02",
      title: "Monitor continuously",
      description: "Watch for patterns that signal emerging risk.",
    },
    {
      number: "03",
      title: "Surface what matters",
      description: "Highlight risks with clear reasoning and context.",
    },
    {
      number: "04",
      title: "Support your decision",
      description: "Provide the clarity needed to act with confidence.",
    },
  ];

  return (
    <section id="how-it-works" className="section-spacing bg-secondary">
      <div className="container-narrow">
        <h2 className="heading-section text-center mb-16">
          How it works
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 shadow-soft flex gap-4"
            >
              <span className="text-2xl font-medium text-sentinals-green">
                {step.number}
              </span>
              <div>
                <h3 className="heading-subsection mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
