import React, { useState, useEffect, useRef } from 'react';
import '../styles/App.css';

const LeaderBackground = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const leaderImages = [
    '/images/leaders/leader1.jpg',
    '/images/leaders/leader2.jpg',
    '/images/leaders/leader3.webp',
    '/images/leaders/leader4.jpg',
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let animationFrameId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetX = (e.clientX - centerX) / centerX * 25;
      targetY = (e.clientY - centerY) / centerY * 20;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      setMousePosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  const getPosition = (index) => {
    if (isMobile) {
      const positions = [
        { top: '10%', left: '5%' },
        { top: '10%', right: '5%' },
        { bottom: '10%', left: '5%' },
        { bottom: '10%', right: '5%' },
      ];
      return positions[index];
    }

    const positions = [
      { top: '15%', left: '10%' },
      { top: '15%', right: '10%' },
      { bottom: '15%', left: '10%' },
      { bottom: '15%', right: '10%' },
    ];
    
    return positions[index];
  };

  const getRotation = (index) => {
    const rotations = [-5, 8, -12, 5];
    return rotations[index];
  };

  const getParallaxSpeed = (index) => {
    const speeds = [0.4, 0.6, 0.8, 0.5];
    return speeds[index];
  };

  return (
    <div ref={containerRef} className={`leader-background ${isMobile ? 'mobile' : 'desktop'}`}>
      {leaderImages.map((src, index) => {
        const position = getPosition(index);
        const rotation = getRotation(index);
        const speed = getParallaxSpeed(index);
        
        const desktopStyle = !isMobile ? {
          transform: `
            translate(${mousePosition.x * speed}px, ${mousePosition.y * speed}px)
            rotate(${rotation}deg)
          `,
          transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
        } : { transform: `rotate(${rotation}deg)` };

        return (
          <div
            key={index}
            className="leader-image-wrapper"
            style={{
              ...position,
              ...desktopStyle,
              '--rotation': `${rotation}deg`,
              '--delay': `${index * 0.3}s`,
              zIndex: index + 1,
            }}
          >
            <img
              src={src}
              alt={`Leader ${index + 1}`}
              className="leader-image"
              loading="lazy"
              data-index={index}
            />
            {!isMobile && <div className="leader-hover-effect"></div>}
          </div>
        );
      })}
      
      {!isMobile && <div className="desktop-effects"></div>}
    </div>
  );
};

export default LeaderBackground;