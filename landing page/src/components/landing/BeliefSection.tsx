const BeliefSection = () => {
  return (
    <section className="section-spacing bg-primary text-primary-foreground">
      <div className="container-narrow text-center">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-8">
          A different way to think about inventory decisions
        </h2>

        <div className="space-y-6 max-w-3xl mx-auto text-primary-foreground/80 text-lg leading-relaxed">
          <p>
            Moving too fast means reacting to symptoms instead of causes. Chasing alerts instead of understanding patterns. Optimizing for response time instead of decision quality.
          </p>

          <p>
            Trusting your information first means seeing problems earlier. Understanding why they happened. Acting from knowledge, not reaction.
          </p>

          <p>
            Trust allows deliberation when others rush. It supports considered decisions over fast ones.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <p className="text-xl md:text-2xl font-medium italic">
            Trust matters more than speed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BeliefSection;
