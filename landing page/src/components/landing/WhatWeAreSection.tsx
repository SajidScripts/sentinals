import { Check, X } from "lucide-react";

const WhatWeAreSection = () => {
  const isNot = [
    "An automation system",
    "A forecasting engine",
    "A replacement for your team's judgment",
    "A tool that takes action on your behalf",
  ];

  const is = [
    "Decision support for inventory risk",
    "Early warning, clearly explained",
    "A layer of clarity between data and action",
  ];

  return (
    <section id="approach" className="section-spacing bg-secondary">
      <div className="container-narrow">
        <h2 className="heading-section text-center mb-16">
          What Sentinals is—and isn't
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="bg-card rounded-lg p-8 shadow-card">
            <h3 className="heading-subsection mb-6">Sentinals is not</h3>
            <ul className="space-y-4">
              {isNot.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="body-regular">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-card rounded-lg p-8 shadow-card border-2 border-sentinals-green">
            <h3 className="heading-subsection mb-6">Sentinals is</h3>
            <ul className="space-y-4">
              {is.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-sentinals-green mt-0.5 flex-shrink-0" />
                  <span className="body-regular">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="heading-subsection">
            Sentinals advises. Humans decide.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatWeAreSection;
