import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ContactInfoStepProps {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    comments?: string;
    marketingConsent: boolean;
  };
  onChange: (contactInfo: {
    name: string;
    email: string;
    phone: string;
    comments?: string;
    marketingConsent: boolean;
  }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ContactInfoStep = ({ contactInfo, onChange, onNext, onPrev }: ContactInfoStepProps) => {
  const updateField = (field: keyof typeof contactInfo, value: string | boolean) => {
    onChange({
      ...contactInfo,
      [field]: value,
    });
  };

  const isValid = contactInfo.name.trim() && contactInfo.email.trim() && contactInfo.phone.trim() && contactInfo.marketingConsent;

  return (
    <div id="fq-contact-step" className="fq-step">
      <div className="fq-step__header">
        <h2 className="fq-step__title">
          Næsten færdig! 📝
        </h2>
        <p className="fq-step__subtitle">
          Vi bruger disse oplysninger til at sende dig personlige futon-anbefalinger.
        </p>
      </div>

      <div className="fq-form-section">
        <div className="fq-input-group">
          <Label htmlFor="fq-contact-name" className="fq-input-group__label">
            Fulde Navn *
          </Label>
          <Input
            id="fq-contact-name"
            type="text"
            placeholder="Indtast dit fulde navn"
            value={contactInfo.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="fq-input-group__input"
            required
          />
        </div>

        <div className="fq-input-group">
          <Label htmlFor="fq-contact-email" className="fq-input-group__label">
            Email Adresse *
          </Label>
          <Input
            id="fq-contact-email"
            type="email"
            placeholder="Indtast din email adresse"
            value={contactInfo.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="fq-input-group__input"
            required
          />
        </div>

        <div className="fq-input-group">
          <Label htmlFor="fq-contact-phone" className="fq-input-group__label">
            Telefonnummer *
          </Label>
          <Input
            id="fq-contact-phone"
            type="tel"
            placeholder="Indtast dit telefonnummer"
            value={contactInfo.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="fq-input-group__input"
            required
          />
        </div>

        <div className="fq-input-group">
          <Label htmlFor="fq-contact-comments" className="fq-input-group__label">
            Yderligere Kommentarer (Valgfrit)
          </Label>
          <Textarea
            id="fq-contact-comments"
            placeholder="Eventuelle specifikke behov, præferencer eller spørgsmål om futoner?"
            value={contactInfo.comments || ""}
            onChange={(e) => updateField("comments", e.target.value)}
            className="min-h-20"
            rows={3}
          />
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="fq-contact-marketing"
            checked={contactInfo.marketingConsent}
            onCheckedChange={(checked) => updateField("marketingConsent", !!checked)}
            className="mt-1"
          />
          <Label htmlFor="fq-contact-marketing" className="text-sm text-muted-foreground leading-relaxed">
            Jeg accepterer at modtage personlige futon-anbefalinger og markedsføringsmateriale via email og telefon. 
            Du kan afmelde dig når som helst. *
          </Label>
        </div>
      </div>

      <div className="fq-info-box bg-primary/5 border border-primary/20">
        <p className="fq-info-box__content text-primary/80">
          🔒 Dine oplysninger er sikre og vil kun blive brugt til at give dig personlige anbefalinger og lejlighedsvise opdateringer om vores produkter.
        </p>
      </div>

      <div className="fq-step__navigation">
        <Button id="fq-contact-back" variant="secondary" onClick={onPrev}>
          Tilbage
        </Button>
        <Button 
          id="fq-contact-submit"
          variant="quiz" 
          onClick={onNext}
          disabled={!isValid}
          className="fq-btn--quiz"
        >
          Få Anbefalinger
        </Button>
      </div>
    </div>
  );
};