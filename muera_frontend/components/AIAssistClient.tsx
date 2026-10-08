"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

export default function AIAssistClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [animating, setAnimating] = useState(false);

  const questions = [
    {
      id: "occasion",
      question: "What is the occasion?",
      options: [
        { label: "A Wedding", value: "Wedding" },
        { label: "Business Formal", value: "Business" },
        { label: "Everyday Elegance", value: "Casual" },
        { label: "A Special Event", value: "Event" },
      ]
    },
    {
      id: "fit",
      question: "How do you prefer the silhouette?",
      options: [
        { label: "Tailored & Slim", value: "Slim" },
        { label: "Classic & Regular", value: "Regular" },
        { label: "Relaxed & Unstructured", value: "Relaxed" },
      ]
    },
    {
      id: "color",
      question: "Which palette aligns with your vision?",
      options: [
        { label: "Midnight Navy", value: "Navy" },
        { label: "Charcoal Grey", value: "Charcoal" },
        { label: "Deep Black", value: "Black" },
        { label: "Earthy Tones", value: "Earth" },
      ]
    }
  ];

  const handleSelect = (questionId: string, value: string) => {
    if (animating) return;
    setAnimating(true);
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    
    if (step < questions.length - 1) {
      setTimeout(() => {
        setStep(step + 1);
        setAnimating(false);
      }, 600);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(step + 1);
        setAnimating(false);
      }, 3000);
    }
  };

  const handleRedirect = () => {
    const params = new URLSearchParams(answers).toString();
    router.push(`/configurator?${params}`);
  };

  return (
    <div className="container" style={{ maxWidth: "700px", margin: "0 auto", padding: "4rem 1rem" }}>
      {step === 0 && !animating && !isProcessing && (
        <div style={{ textAlign: "center", marginBottom: "4rem", animation: "fadeIn 1s ease forwards" }}>
          <p className="section-label" style={{ marginBottom: "1.5rem" }}>Bespoke Intelligence</p>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Sartorial Consultation
          </h1>
          <p style={{ color: "var(--color-mid-gray)", fontSize: "1.0625rem", maxWidth: "460px", margin: "0 auto", marginTop: "1rem" }}>
            Allow our intelligence to guide you to the perfect configuration for your next made-to-measure piece.
          </p>
        </div>
      )}

      <div style={{
        position: "relative",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
          }
          @keyframes pulseText {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
          }
          .step-container {
            width: 100%;
            animation: fadeIn 0.8s ease forwards;
          }
          .step-container.animating-out {
            animation: fadeOut 0.5s ease forwards;
          }
          .premium-option {
            display: block;
            width: 100%;
            padding: 1.25rem 2rem;
            margin-bottom: 1rem;
            background: transparent;
            border: 1px solid var(--color-light-gray);
            font-family: var(--font-serif);
            font-size: 1.125rem;
            color: var(--color-black);
            text-align: left;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
          }
          .premium-option::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0;
            height: 1px;
            background: var(--color-gold);
            transition: width 0.4s ease;
          }
          .premium-option:hover {
            border-color: var(--color-gold);
            background: rgba(245, 243, 239, 0.5);
            padding-left: 2.5rem;
          }
          .premium-option:hover::after {
            width: 100%;
          }
        `}</style>

        {step < questions.length && !isProcessing && (
          <div className={`step-container ${animating ? 'animating-out' : ''}`}>
            <p className="section-label" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              0{step + 1} — 0{questions.length}
            </p>
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: "3rem", fontSize: "2rem" }}>
              {questions[step].question}
            </h2>
            <div style={{ maxWidth: "480px", margin: "0 auto" }}>
              {questions[step].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(questions[step].id, opt.value)}
                  className="premium-option"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="step-container" style={{ textAlign: "center" }}>
            <h2 className="section-title" style={{ fontSize: "1.75rem", marginBottom: "1.5rem", animation: "pulseText 2s infinite" }}>
              Curating your profile...
            </h2>
            <p style={{ color: "var(--color-mid-gray)", fontSize: "0.9375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Analyzing preferences against our premium fabrics
            </p>
            <div style={{ 
              width: "1px", 
              height: "40px", 
              background: "var(--color-gold)", 
              margin: "3rem auto",
              animation: "pulseText 1.5s infinite"
            }} />
          </div>
        )}

        {step === questions.length && !isProcessing && (
          <div className="step-container" style={{ textAlign: "center" }}>
            <p className="section-label" style={{ marginBottom: "1rem", color: "var(--color-gold)" }}>
              Recommendation Ready
            </p>
            <h2 className="section-title" style={{ fontSize: "2.25rem", marginBottom: "2rem" }}>
              The Perfect Configuration
            </h2>
            <div style={{ 
              borderTop: "1px solid var(--color-light-gray)", 
              borderBottom: "1px solid var(--color-light-gray)", 
              padding: "2.5rem 0",
              margin: "0 auto 3rem",
              maxWidth: "500px"
            }}>
              <p style={{ 
                fontFamily: "var(--font-serif)", 
                fontSize: "1.25rem", 
                lineHeight: 1.8,
                color: "var(--color-black)"
              }}>
                We suggest a <strong>{answers.color}</strong> tailored piece with a <strong>{answers.fit}</strong> silhouette, precisely suited for <strong>{answers.occasion}</strong>.
              </p>
            </div>
            
            <button 
              onClick={handleRedirect}
              className="btn btn--primary"
            >
              View in 3D Configurator
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
