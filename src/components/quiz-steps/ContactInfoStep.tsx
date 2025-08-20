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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Almost Done! 📝
        </h2>
        <p className="text-muted-foreground">
          We'll use this information to send you personalized futon recommendations.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-medium">
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={contactInfo.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={contactInfo.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-medium">
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={contactInfo.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comments" className="text-base font-medium">
            Additional Comments (Optional)
          </Label>
          <Textarea
            id="comments"
            placeholder="Any specific needs, preferences, or questions about futons?"
            value={contactInfo.comments || ""}
            onChange={(e) => updateField("comments", e.target.value)}
            className="min-h-20"
            rows={3}
          />
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="marketing"
            checked={contactInfo.marketingConsent}
            onCheckedChange={(checked) => updateField("marketingConsent", !!checked)}
            className="mt-1"
          />
          <Label htmlFor="marketing" className="text-sm text-muted-foreground leading-relaxed">
            I agree to receive personalized futon recommendations and marketing communications via email and phone. 
            You can unsubscribe at any time. *
          </Label>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8">
        <p className="text-sm text-primary/80">
          🔒 Your information is secure and will only be used to provide you with personalized recommendations and occasional updates about our products.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onPrev}>
          Back
        </Button>
        <Button 
          variant="quiz" 
          onClick={onNext}
          disabled={!isValid}
        >
          Get Recommendations
        </Button>
      </div>
    </div>
  );
};