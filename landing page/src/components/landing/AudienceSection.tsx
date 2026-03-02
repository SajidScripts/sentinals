const AudienceSection = () => {
  return (
    <section className="section-spacing">
      <div className="container-narrow">
        <h2 className="heading-section text-center mb-6">
          Built for those who own the outcome
        </h2>
        <p className="body-large text-center max-w-2xl mx-auto mb-12">
          Sentinals is for leaders who carry responsibility for inventory decisions—and the consequences that follow.
        </p>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-secondary rounded-lg p-6">
            <h3 className="heading-subsection mb-2">Operations leaders</h3>
            <p className="text-muted-foreground">
              Who need early visibility into supply chain risk.
            </p>
          </div>

          <div className="bg-secondary rounded-lg p-6">
            <h3 className="heading-subsection mb-2">Inventory managers</h3>
            <p className="text-muted-foreground">
              Who balance availability against capital efficiency.
            </p>
          </div>

          <div className="bg-secondary rounded-lg p-6">
            <h3 className="heading-subsection mb-2">Finance executives</h3>
            <p className="text-muted-foreground">
              Who need to understand inventory exposure before it hits the balance sheet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
