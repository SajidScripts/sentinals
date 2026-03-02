const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center section-spacing pt-32">
      <div className="container-narrow text-center">
        <div className="animate-fade-in">
          <h1 className="heading-hero mb-6">
            Know before it costs you.
          </h1>
        </div>

        <div className="animate-fade-in-delay">
          <p className="body-large max-w-2xl mx-auto mb-8">
            Inventory risk intelligence that surfaces what matters early.
          </p>
        </div>

        <div className="animate-fade-in-delay-2">
          <p className="belief-statement mb-12">
            Trust matters more than speed.
          </p>
        </div>

        <div className="animate-fade-in-delay-2">
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-3.5 text-base font-medium text-primary-foreground bg-primary rounded-md hover:bg-sentinals-navy-light transition-colors"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
