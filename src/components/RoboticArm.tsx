import { useEffect, useRef, useState } from 'react';

/**
 * Robotic arm mascot. A two-segment arm with a gripper that reaches
 * toward the visitor's cursor using simple two-bone inverse kinematics.
 * Pure SVG + math — no 3D, no heavy libraries.
 */

const SHOULDER = { x: 110, y: 186 };
const L1 = 72; // upper arm length
const L2 = 58; // forearm length

type Pose = {
  elbowX: number;
  elbowY: number;
  handX: number;
  handY: number;
  wristAngle: number;
  grip: number;
};

const IDLE_TARGET = { x: 160, y: 80 };

function solve(tx: number, ty: number): Pose {
  const dx = tx - SHOULDER.x;
  const dy = ty - SHOULDER.y;
  const rawD = Math.hypot(dx, dy);
  const maxD = L1 + L2 - 2;
  const minD = 24;
  // Free reach in every direction — only limited by the arm's own length
  const d = Math.min(Math.max(rawD, minD), maxD);

  const a0 = Math.atan2(dy, dx);
  const cosA = Math.min(1, Math.max(-1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)));
  const bend = Math.acos(cosA);

  // Two elbow solutions exist; pick the one with the smaller vertical drop
  // so the elbow never pokes out of the frame (fixes reaching downward).
  const u1 = a0 - bend;
  const u2 = a0 + bend;
  const upperAngle = Math.sin(u1) <= Math.sin(u2) ? u1 : u2;

  const elbowX = SHOULDER.x + L1 * Math.cos(upperAngle);
  const elbowY = SHOULDER.y + L1 * Math.sin(upperAngle);

  const wristAngle = Math.atan2(ty - elbowY, tx - elbowX);
  const handX = elbowX + L2 * Math.cos(wristAngle);
  const handY = elbowY + L2 * Math.sin(wristAngle);

  const grip = Math.min(0.9, Math.max(0.2, (maxD - d) / 60));

  return { elbowX, elbowY, handX, handY, wristAngle, grip };
}

export const RoboticArm = () => {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef<{ x: number; y: number }>(IDLE_TARGET);
  const current = useRef({ ...IDLE_TARGET });
  const [pose, setPose] = useState<Pose>(() => solve(IDLE_TARGET.x, IDLE_TARGET.y));

  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const el = ref.current?.querySelector('svg');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      target.current = {
        x: ((e.clientX - rect.left) / rect.width) * 220,
        y: ((e.clientY - rect.top) / rect.height) * 240,
      };
    };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      const t = target.current;
      const c = current.current;
      c.x += (t.x - c.x) * 0.14;
      c.y += (t.y - c.y) * 0.14;
      setPose(solve(c.x, c.y));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const clawSpread = pose.grip * 0.45;

  return (
    <div ref={ref} className="w-full max-w-sm mx-auto select-none" aria-label="Robotic arm that follows your cursor">
      <svg viewBox="0 0 220 240" className="w-full drop-shadow-xl overflow-visible" style={{ overflow: 'visible' }}>
        {/* Ground plate */}
        <rect x="60" y="222" width="100" height="12" rx="6" fill="hsl(var(--muted))" />
        <rect x="80" y="204" width="60" height="20" rx="8" fill="hsl(var(--border))" />
        <rect x="92" y="188" width="36" height="18" rx="6" fill="hsl(var(--muted))" />

        {/* Upper arm */}
        <line x1={SHOULDER.x} y1={SHOULDER.y} x2={pose.elbowX} y2={pose.elbowY}
          stroke="hsl(var(--border))" strokeWidth="20" strokeLinecap="round" />
        <line x1={SHOULDER.x} y1={SHOULDER.y} x2={pose.elbowX} y2={pose.elbowY}
          stroke="hsl(var(--muted))" strokeWidth="13" strokeLinecap="round" />
        <line x1={SHOULDER.x} y1={SHOULDER.y} x2={pose.elbowX} y2={pose.elbowY}
          stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.5" />

        {/* Forearm */}
        <line x1={pose.elbowX} y1={pose.elbowY} x2={pose.handX} y2={pose.handY}
          stroke="hsl(var(--border))" strokeWidth="15" strokeLinecap="round" />
        <line x1={pose.elbowX} y1={pose.elbowY} x2={pose.handX} y2={pose.handY}
          stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" />

        {/* Shoulder joint */}
        <circle cx={SHOULDER.x} cy={SHOULDER.y} r="14" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="3" />
        <circle cx={SHOULDER.x} cy={SHOULDER.y} r="5" fill="hsl(var(--primary))" />

        {/* Elbow joint */}
        <circle cx={pose.elbowX} cy={pose.elbowY} r="9" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="3" />
        <circle cx={pose.elbowX} cy={pose.elbowY} r="3.5" fill="hsl(var(--primary))" />

        {/* Gripper */}
        <circle cx={pose.handX} cy={pose.handY} r="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2.5" />
        {[-1, 1].map((side) => {
          const a = pose.wristAngle + side * clawSpread;
          const tipX = pose.handX + 20 * Math.cos(a);
          const tipY = pose.handY + 20 * Math.sin(a);
          const midX = pose.handX + 11 * Math.cos(a);
          const midY = pose.handY + 11 * Math.sin(a);
          const hookX = midX + 6 * Math.cos(a + side * 0.9);
          const hookY = midY + 6 * Math.sin(a + side * 0.9);
          return (
            <g key={side}>
              <line x1={pose.handX} y1={pose.handY} x2={midX} y2={midY}
                stroke="hsl(var(--foreground))" strokeWidth="4" strokeLinecap="round" />
              <line x1={midX} y1={midY} x2={tipX} y2={tipY}
                stroke="hsl(var(--foreground))" strokeWidth="4" strokeLinecap="round" />
              <circle cx={hookX} cy={hookY} r="2" fill="hsl(var(--primary))" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
