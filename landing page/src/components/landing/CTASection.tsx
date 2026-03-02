const CTASection = () => {
  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const emailTo = "sajid.skyninja@gmail.com";
    const subject = "Let's discuss Sentinals - Inquiry from Landing Page";
    const body = "Hi Sajid,\n\nI'm interested in learning more about Sentinals and how it can help with inventory risk intelligence.\n\n";

    // Detect operating system
    const userAgent = navigator.userAgent.toLowerCase();
    const isMac = /macintosh|mac os x/i.test(userAgent);
    const isWindows = /windows|win32|win64/i.test(userAgent);

    if (isWindows) {
      // Open Gmail compose in browser for Windows users
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTo)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank');
    } else if (isMac) {
      // Open Apple Mail for Mac users
      const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    } else {
      // Fallback to mailto for other OS (Linux, etc.)
      const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    }
  };

  return (
    <section id="contact" className="section-spacing bg-primary text-primary-foreground">
      <div className="container-narrow text-center">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">
          Start with a conversation
        </h2>

        <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-10">
          A discussion about whether Sentinals addresses your needs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            onClick={handleEmailClick}
            className="inline-flex items-center px-8 py-3.5 text-base font-medium bg-primary-foreground text-primary rounded-md hover:bg-primary-foreground/90 transition-colors"
          >
            Contact us
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center px-8 py-3.5 text-base font-medium border border-primary-foreground/30 text-primary-foreground rounded-md hover:bg-primary-foreground/10 transition-colors"
          >
            Read how it works
          </a>
        </div>

        <p className="text-primary-foreground/60 text-sm mt-8">
          No commitment required.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
