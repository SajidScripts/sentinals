import mascot from "@/assets/sentinals-mascot.png";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container-narrow">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src={mascot} 
              alt="Sentinals" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg font-medium text-primary">Sentinals</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Inventory risk intelligence. Clarity before action.
          </p>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sentinals
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
