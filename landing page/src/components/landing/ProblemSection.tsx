const ProblemSection = () => {
  return (
    <section id="problem" className="section-spacing bg-secondary">
      <div className="container-narrow">
        <h2 className="heading-section text-center mb-16">
          The cost of knowing too late
        </h2>

        <div className="space-y-8 max-w-3xl mx-auto">
          <p className="body-regular">
            Inventory problems build quietly. They exist in spreadsheets, dashboards, and systems. The data is present. The insight is not.
          </p>

          <p className="body-regular">
            Discovery often comes too late. Stockouts disrupt orders. Excess inventory ties up capital. Customers find alternatives.
          </p>

          <p className="body-regular">
            Teams rarely fail from lack of information. They fail when the warning comes too late.
          </p>

          <div className="divider-soft my-12" />

          <p className="heading-subsection text-center">
            The real risk is discovering problems after the loss.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
