const WhyToolsFailSection = () => {
  return (
    <section className="section-spacing">
      <div className="container-narrow">
        <h2 className="heading-section text-center mb-16">
          Speed alone doesn't prevent loss
        </h2>

        <div className="space-y-8 max-w-3xl mx-auto">
          <p className="body-regular">
            Many tools emphasize speed. Faster alerts, quicker insights, instant visibility. But faster alerts do not guarantee better decisions.
          </p>

          <p className="body-regular">
            In volatile environments, speed can create noise. More alerts lead to alert fatigue. Dashboards refresh constantly. Understanding remains shallow.
          </p>

          <p className="body-regular">
            Reaction time improves. Judgment does not.
          </p>

          <p className="body-regular">
            Teams respond quickly to low-priority items and slowly to high-priority ones.
          </p>

          <div className="bg-sentinals-green-muted rounded-lg p-8 mt-12">
            <p className="heading-subsection text-center">
              Faster responses do not guarantee better outcomes. Clear understanding does.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyToolsFailSection;
