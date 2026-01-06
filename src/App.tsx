import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Shield, Zap, RefreshCw, Activity } from 'lucide-react';

// --- Card Component ---

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  delay: number;
}

const FeatureCard = ({ title, icon, delay }: FeatureCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth tilt
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 20 });

  const [isHovered, setIsHovered] = useState(false);

  // Floating animation variants
  const floatVariants: import('framer-motion').Variants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        delay: delay,
      }
    },
    hover: {
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Dynamic box shadow for glow
  const glowStyle = isHovered
    ? "0 0 30px rgba(0, 242, 255, 0.6), inset 0 0 20px rgba(0, 242, 255, 0.2)"
    : "0 4px 6px rgba(0, 0, 0, 0.1)";

  return (
    <motion.div
      variants={floatVariants}
      animate={isHovered ? "hover" : "animate"}
      className="card-wrapper"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="feature-card"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: glowStyle
        }}
      >
        <motion.div
          className="card-icon"
          style={{ transform: "translateZ(30px)" }}
        >
          {icon}
        </motion.div>

        <motion.h3
          className="card-title"
          style={{ transform: "translateZ(20px)" }}
        >
          {title}
        </motion.h3>

        <motion.p
          className="card-desc"
          style={{ transform: "translateZ(10px)" }}
        >
          Advanced protection utilizing next-gen AI heuristics to safeguard your digital perimeter.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// --- Main App Component ---

function App() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="app-container">

      {/* Background Elements */}
      <motion.div style={{ y: y1 }} className="bg-layer nebula-bg" />
      <motion.div style={{ y: y2 }} className="bg-layer grid-bg" />

      {/* Hero Section */}
      <div className="hero-section">

        {/* Pulsing Heart Header */}
        <div className="hero-header">
          <motion.div
            animate={{ scale: [1, 1.1, 1], filter: ["drop-shadow(0 0 5px #00ff00)", "drop-shadow(0 0 15px #00ff00)", "drop-shadow(0 0 5px #00ff00)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginBottom: '1rem' }}
          >
            <Activity size={48} color="#00ff00" strokeWidth={3} />
          </motion.div>
          <h1 className="title">
            Vanguard AI
          </h1>
          <p className="subtitle">
            Zero-Gravity Defense Systems
          </p>
        </div>

        {/* Feature Cards Container */}
        <div className="cards-container">
          <FeatureCard
            title="Behavioral Shield"
            icon={<Shield size={64} />}
            delay={0}
          />
          <FeatureCard
            title="Decoy System"
            icon={<Zap size={64} />}
            delay={1.5}
          />
          <FeatureCard
            title="One-Click Recovery"
            icon={<RefreshCw size={64} />}
            delay={0.8}
          />
        </div>

        {/* Padding for scroll demonstration */}
        <div className="scroll-hint">
          <p>Scroll to experience the parallax effect</p>
        </div>
      </div>
    </div>
  );
}

export default App;
