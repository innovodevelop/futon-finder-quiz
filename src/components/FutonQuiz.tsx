import { useState } from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import { StartStep } from "./quiz-steps/StartStep";
import { PeopleCountStep } from "./quiz-steps/PeopleCountStep";
import { WeightStep } from "./quiz-steps/WeightStep";
import { SleepPositionStep } from "./quiz-steps/SleepPositionStep";
import { PreferenceStep } from "./quiz-steps/PreferenceStep";
import { ContactInfoStep } from "./quiz-steps/ContactInfoStep";
import { RecommendationStep } from "./quiz-steps/RecommendationStep";

export interface QuizData {
  peopleCount: 1 | 2;
  weights: {
    person1: number;
    person2?: number;
  };
  heights: {
    person1: number;
    person2?: number;
  };
  sleepPositions: {
    person1: "side" | "belly-back" | "both";
    person2?: "side" | "belly-back" | "both";
  };
  preferences: {
    person1: "soft" | "medium" | "hard";
    person2?: "soft" | "medium" | "hard";
  };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    comments?: string;
    marketingConsent: boolean;
  };
}

const initialQuizData: QuizData = {
  peopleCount: 1,
  weights: {
    person1: 0,
  },
  heights: {
    person1: 0,
  },
  sleepPositions: {
    person1: "side",
  },
  preferences: {
    person1: "medium",
  },
  contactInfo: {
    name: "",
    email: "",
    phone: "",
    comments: "",
    marketingConsent: false,
  },
};

export const FutonQuiz = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>(initialQuizData);
  const totalSteps = 7; // Including the recommendation step

  const updateQuizData = (updates: Partial<QuizData>) => {
    setQuizData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StartStep onNext={nextStep} />;
      case 2:
        return (
          <PeopleCountStep
            value={quizData.peopleCount}
            onChange={(peopleCount) => updateQuizData({ peopleCount })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <WeightStep
            peopleCount={quizData.peopleCount}
            weights={quizData.weights}
            heights={quizData.heights}
            onChange={(weights, heights) => updateQuizData({ weights, heights })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <SleepPositionStep
            peopleCount={quizData.peopleCount}
            sleepPositions={quizData.sleepPositions}
            onChange={(sleepPositions) => updateQuizData({ sleepPositions })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <PreferenceStep
            peopleCount={quizData.peopleCount}
            preferences={quizData.preferences}
            onChange={(preferences) => updateQuizData({ preferences })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <ContactInfoStep
            contactInfo={quizData.contactInfo}
            onChange={(contactInfo) => updateQuizData({ contactInfo })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 7:
        return (
          <RecommendationStep
            quizData={quizData}
            onRestart={() => {
              setCurrentStep(1);
              setQuizData(initialQuizData);
            }}
          />
        );
      default:
        return <StartStep onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {currentStep > 1 && (
          <ProgressIndicator currentStep={currentStep - 1} totalSteps={6} />
        )}
        <div className="bg-card rounded-3xl shadow-card p-6 md:p-10">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};