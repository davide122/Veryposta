"use client";
import { createContext, useContext, useEffect } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

// Contesto per le animazioni
const AnimationContext = createContext();

// Hook personalizzato per utilizzare le animazioni
export const useAnimation = () => useContext(AnimationContext);

// Componente per animazioni di fade-in durante lo scroll
export const FadeIn = ({ children, delay = 0, direction = 'up', threshold = 0.2, triggerOnce = true }) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });

  // Configurazione delle direzioni di animazione
  const directions = {
    up: { from: { y: 40 }, to: { y: 0 } },
    down: { from: { y: -40 }, to: { y: 0 } },
    left: { from: { x: -40 }, to: { x: 0 } },
    right: { from: { x: 40 }, to: { x: 0 } },
    none: { from: {}, to: {} }
  };

  const directionProps = directions[direction] || directions.up;

  const props = useSpring({
    from: {
      opacity: 0,
      ...directionProps.from
    },
    to: {
      opacity: inView ? 1 : 0,
      ...inView ? directionProps.to : directionProps.from
    },
    delay: delay * 100,
    config: { ...config.gentle, tension: 280, friction: 18 }
  });

  return (
    <animated.div ref={ref} style={props}>
      {children}
    </animated.div>
  );
};

// Componente per animazioni di scale (zoom)
export const ScaleIn = ({ children, delay = 0, threshold = 0.2, triggerOnce = true }) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });

  const props = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { 
      opacity: inView ? 1 : 0, 
      scale: inView ? 1 : 0.9 
    },
    delay: delay * 100,
    config: { ...config.gentle, tension: 260, friction: 15 }
  });

  return (
    <animated.div ref={ref} style={props}>
      {children}
    </animated.div>
  );
};

// Componente per animazioni di slide
export const SlideIn = ({ children, delay = 0, direction = 'right', distance = 100, threshold = 0.2, triggerOnce = true }) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });

  // Configurazione delle direzioni di slide
  const getTransform = () => {
    switch (direction) {
      case 'left': return { x: -distance, y: 0 };
      case 'right': return { x: distance, y: 0 };
      case 'up': return { x: 0, y: -distance };
      case 'down': return { x: 0, y: distance };
      default: return { x: distance, y: 0 };
    }
  };

  const from = getTransform();

  const props = useSpring({
    from: { opacity: 0, transform: `translate3d(${from.x}px, ${from.y}px, 0)` },
    to: { 
      opacity: inView ? 1 : 0, 
      transform: inView ? 'translate3d(0px, 0px, 0)' : `translate3d(${from.x}px, ${from.y}px, 0)` 
    },
    delay: delay * 100,
    config: { ...config.gentle, tension: 280, friction: 20 }
  });

  return (
    <animated.div ref={ref} style={props}>
      {children}
    </animated.div>
  );
};

// Componente per effetto parallax
export const Parallax = ({ children, strength = 50, threshold = 0 }) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: false,
  });

  const [{ offset }, api] = useSpring(() => ({ 
    offset: 0,
    config: { mass: 1, tension: 280, friction: 60 }
  }));

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollPercentage = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
      api.start({ offset: scrollPercentage * strength });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [api, ref, strength]);

  return (
    <animated.div ref={ref} style={{ transform: offset.to(o => `translate3d(0, ${o}px, 0)`) }}>
      {children}
    </animated.div>
  );
};

// Componente per animazioni di numeri
export const CountUp = ({ children, from = 0, to, duration = 2000, delay = 0, threshold = 0.2, triggerOnce = true }) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });

  const { number } = useSpring({
    from: { number: from },
    number: inView ? to : from,
    delay: delay * 100,
    config: { duration }
  });

  return (
    <animated.span ref={ref}>
      {number.to(n => Math.floor(n))}
      {children}
    </animated.span>
  );
};

// Componente per hover effects
export const HoverEffect = ({ children, scale = 1.05, rotation = 0, className = '' }) => {
  const [props, api] = useSpring(() => ({
    scale: 1,
    rotation: 0,
    config: { mass: 1, tension: 350, friction: 10 }
  }));

  const handleMouseEnter = () => {
    api.start({
      scale,
      rotation,
    });
  };

  const handleMouseLeave = () => {
    api.start({
      scale: 1,
      rotation: 0,
    });
  };

  return (
    <animated.div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: props.scale
          .to(s => `scale(${s})`)
          .to(s => `${s} rotate(${props.rotation.get()}deg)`),
      }}
    >
      {children}
    </animated.div>
  );
};

// Provider principale per le animazioni
export function AnimationProvider({ children }) {
  return (
    <AnimationContext.Provider value={{}}>
      {children}
    </AnimationContext.Provider>
  );
}