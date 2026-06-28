import { useEffect, useState } from 'react';
import ParticleField from './ParticleField';

export default function PageBackground() {
  const [coords, setCoords] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <ParticleField />
      <div
        className="fixed pointer-events-none z-[1] w-[500px] h-[500px] rounded-full hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(0,180,255,0.08) 0%, transparent 70%)',
          left: `${coords.x - 250}px`,
          top: `${coords.y - 250}px`,
        }}
      />
    </>
  );
}
