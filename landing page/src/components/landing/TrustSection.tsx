import { Shield, Eye, VolumeX } from "lucide-react";

const TrustSection = () => {
  const trustPoints = [
    {
      icon: Shield,
      title: "No autonomous actions",
      description: "Sentinals does not place orders, adjust inventory, or make decisions. It observes and reports. You control what happens next.",
    },
    {
      icon: Eye,
      title: "Every signal explained",
      description: "When Sentinals identifies a risk, it explains why. The reasoning is documented. The logic is auditable.",
    },
    {
      icon: VolumeX,
      title: "Silence when appropriate",
      description: "When there is no meaningful risk, Sentinals remains silent. It does not generate alerts without cause.",
    },
  ];

  return (
    <section className="section-spacing">
      <div className="container-narrow">
        <h2 className="heading-section text-center mb-6">
          How Sentinals earns trust
        </h2>
        <p className="body-large text-center max-w-2xl mx-auto mb-16">
          Trust is not claimed. It is demonstrated through restraint.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {trustPoints.map((point, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sentinals-green-muted mb-6">
                <point.icon className="w-6 h-6 text-sentinals-navy" />
              </div>
              <h3 className="heading-subsection mb-4">{point.title}</h3>
              <p className="body-regular">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
