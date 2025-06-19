import React, { useState } from "react";
import jsPDF from "jspdf";
import headerImage from "./force-multiplier-header.png";
import logoImage from "./bitf-logo.png";
import signatureImage from "./signature.png";

const quizData = [
  {
    pillar: "PRESENCE",
    descriptions: [
      "ASLEEP (1–3): You're physically in the house, but emotionally absent. Constantly distracted, checked out, a ghost in your own home.",
      "AWAKE (4–6): You try to show up but often fail to unplug. You're present, but your attention is missing.",
      "ACTIVE (7–9): You consistently engage. You leave the phone behind. You're in the room and in the moment.",
      "ACCELERATED (10–12): You are magnetic. Your presence brings peace and joy. Your kids crave your time because it fuels their soul."
    ]
  },
  {
    pillar: "PROTECTOR",
    descriptions: [
      "ASLEEP (1–3): You've abandoned your post. Your children feel unsafe around you—or from you.",
      "AWAKE (4–6): You recognize danger, but you're inconsistent. You're reactive instead of proactive.",
      "ACTIVE (7–9): You’re calm, present, and steady. You've created a physically and emotionally safe home.",
      "ACCELERATED (10–12): You are both shield and sword. You are feared by predators, trusted by your family."
    ]
  },
  {
    pillar: "PROVIDER",
    descriptions: [
      "ASLEEP (1–3): You're surviving at best. You provide the bare minimum and resent being asked for more.",
      "AWAKE (4–6): You hustle but without vision. You play small because fear or shame holds you back.",
      "ACTIVE (7–9): You are building. You don’t just pay bills—you inspire. Your kids see your effort and hunger.",
      "ACCELERATED (10–12): You are building legacy. Your provision isn’t just money—it’s mindset, possibility, and vision."
    ]
  },
  {
    pillar: "PLAYMATE",
    descriptions: [
      "ASLEEP (1–3): You don’t laugh. You don’t play. Your kids don’t see joy in you—they see distance.",
      "AWAKE (4–6): You engage occasionally—but you rarely initiate. Fun feels like a chore.",
      "ACTIVE (7–9): You lead in joy. You show up silly, loud, creative. You make memories that matter.",
      "ACCELERATED (10–12): You are the epicenter of joy. Your presence is unforgettable and inspiring."
    ]
  },
  {
    pillar: "PRAYER",
    descriptions: [
      "ASLEEP (1–3): You don’t pray. You’re silent in the most important battle. Your home is spiritually unguarded.",
      "AWAKE (4–6): You pray when prompted by fear or pressure. You’re spiritually interested—but not invested.",
      "ACTIVE (7–9): You lead your home in prayer and scripture. Your kids see your faith in action.",
      "ACCELERATED (10–12): You are a spiritual warrior. You live your life as a sermon they’ll remember forever."
    ]
  }
];

export default function FrontlineFatherQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState(Array(quizData.length).fill(6));
  const [finished, setFinished] = useState(false);

  const handleSliderChange = (value) => {
    const newScores = [...scores];
    newScores[currentStep] = Number(value);
    setScores(newScores);
  };

  const handleNext = () => {
    if (currentStep === quizData.length - 1) {
      setFinished(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // HEADER
    doc.addImage(headerImage, "PNG", 10, 10, 190, 25);
    let y = 45;

    quizData.forEach((item, index) => {
      const score = scores[index];
      const bracket = Math.floor((score - 1) / 3);

      // Section divider line
      doc.setDrawColor(224, 100, 57);
      doc.setLineWidth(0.5);
      doc.line(10, y, 200, y);
      y += 4;

      doc.setFontSize(16);
      doc.setTextColor(224, 100, 57);
      doc.text(item.pillar, 20, y);
      y += 8;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Score: ${score}`, 20, y);
      y += 8;

      const lines = doc.splitTextToSize(item.descriptions[bracket], 170);
      doc.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("You’ve seen your numbers. You’ve seen the truth.", 20, y);
    y += 10;
    doc.text("So now the question is this: What are you going to do about it?", 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text("Join the 42-Day FORCE MULTIPLIER CHALLENGE and become the man your family runs toward, not from.", 20, y);
    y += 8;
    doc.text("This is your invitation to rise. Lead. Protect. Provide. Play. Pray.", 20, y);
    y += 10;
    doc.text("Sign up now at: www.ForceMultiplierChallenge.com", 20, y);

    // BITF Logo and Signature
    y += 10;
    doc.addImage(logoImage, "PNG", 20, y, 40, 20);
    doc.addImage(signatureImage, "PNG", 140, y, 50, 20);

    doc.save("frontline-father-assessment.pdf");
  };

  if (finished) {
    const totalScore = scores.reduce((acc, val) => acc + val, 0);
    return (
      <div className="container">
        <h1>Your Final Score: {totalScore}/60</h1>
        <p>Download your full report below—and then take action.</p>
        <button onClick={handleDownloadPDF}>Download PDF Report</button>
      </div>
    );
  }

  const current = quizData[currentStep];
  const score = scores[currentStep];
  const bracket = Math.floor((score - 1) / 3);

  return (
    <div className="container">
      <h1>{current.pillar}</h1>
      <input
        type="range"
        min="1"
        max="12"
        value={score}
        onChange={(e) => handleSliderChange(e.target.value)}
      />
      <p>Selected Score: {score}</p>
      <div>
        {current.descriptions.map((desc, index) => (
          <p key={index} style={{ fontWeight: bracket === index ? 'bold' : 'normal' }}>{desc}</p>
        ))}
      </div>
      <button onClick={handleNext} style={{ marginTop: "20px" }}>Next</button>
    </div>
  );
}
