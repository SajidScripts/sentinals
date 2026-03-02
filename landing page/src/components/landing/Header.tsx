import mascot from "@/assets/sentinals-mascot.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container-wide flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <img 
            src={mascot} 
            alt="Sentinals" 
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-medium text-primary">Sentinals</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#problem" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            The Problem
          </a>
          <a href="#approach" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Our Approach
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>
        <a 
          href="#contact"
          className="hidden md:inline-flex items-center px-5 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-sentinals-navy-light transition-colors"
        >
          Learn More
        </a>
      </div>
    </header>
  );
};

export default Header;
