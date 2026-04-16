import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  type: 'opening' | 'hackbegins' | 'workshop' | 'meal' | 'checkpoint' | 'closing';
}

type TimelineItem = 
  | (TimelineEvent & { isMarker: false })
  | { isMarker: true; label: string };

const day1Events: TimelineEvent[] = [
  { time: '08:00 AM', title: 'Registration Opens', description: 'Check-in and kit collection', type: 'opening' },
  { time: '09:00 AM', title: 'Inauguration Ceremony', description: 'Opening keynote + rules brief', type: 'opening' },
  { time: '11:00 AM', title: 'HACK BEGINS', description: '24-hour countdown starts NOW', type: 'hackbegins' },
  { time: '01:00 PM', title: 'Lunch Break', description: 'Fuel up — keep building', type: 'meal' },
  { time: '03:00 PM', title: 'Hacking + Mentors', description: 'Build, Iterate, Get Guidance', type: 'workshop' },
  { time: '08:00 PM', title: 'Dinner', description: 'Pause, Eat, Reset Energy', type: 'meal' },
  { time: '11:59 PM', title: 'Day 1 Ends', description: 'Keep going. Night is young.', type: 'checkpoint' },
];

const day2Events: TimelineEvent[] = [
  { time: '07:00 AM', title: 'Breakfast', description: 'Fuel up — keep building', type: 'meal' },
  { time: '11:00 AM', title: 'SUBMISSIONS CLOSE', description: 'Freeze your code', type: 'hackbegins' },
  { time: '11:45 AM', title: 'Project Presentations', description: 'Demo to judges', type: 'opening' },
  { time: '01:00 PM', title: 'CLOSING CEREMONY', description: 'Winners announced. Glory.', type: 'closing' },
];

export const MobileTimeline: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<(HTMLDivElement | null)[]>([]);

  const allEvents: TimelineItem[] = [
    { isMarker: true, label: 'DAY 01 INIT' },
    ...day1Events.map(e => ({ ...e, isMarker: false } as const)),
    { isMarker: true, label: 'NIGHT_PHASE_OVERRIDE_DAY_02' },
    ...day2Events.map(e => ({ ...e, isMarker: false } as const))
  ];

  const animateEvents = () => {
    gsap.to('.tl-spine', {
      height: '100%',
      duration: 2.2,
      ease: 'power2.inOut'
    });
    gsap.to('.tl-event', {
      opacity: 1,
      x: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    });
    gsap.to('.tl-day-marker-box', {
      opacity: 1,
      scale: 1,
      stagger: 0.2,
      duration: 0.6,
      ease: 'back.out(1.5)'
    });
    gsap.fromTo('.tl-dot',
      { scale: 0 },
      { scale: 1, stagger: 0.1, duration: 0.4, ease: 'back.out(2)', delay: 0.1 }
    );
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.section-label',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.5,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }
        }
      );

      gsap.fromTo('.section-heading .word',
        { y: '100%', opacity: 0 },
        {
          y: '0%', opacity: 1, stagger: 0.25, duration: 1.5,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );

      ScrollTrigger.create({
        trigger: trackRef.current,
        start: 'top 75%',
        onEnter: animateEvents
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="timeline" ref={sectionRef} className="mobile-section">
      <div className="section-divider" />
      <div className="section-label">// 002 — TIMELINE</div>
      <h2 className="section-heading" style={{ marginBottom: '32px' }}>
        <span className="word">24H</span>{' '}
        <span className="word">SCHEDULE</span>
      </h2>

      <div ref={trackRef} className="timeline-track section-body" style={{ marginTop: '32px' }}>
        <div className="tl-spine" />
        {allEvents.map((item, i) => {
          if (item.isMarker) {
            return (
              <div key={`marker-${i}`} className="tl-day-marker-box tl-event">
                <div className="marker-hud-glitch">
                  <span className="marker-hud-text">{item.label}</span>
                  <div className="marker-hud-line"/>
                </div>
              </div>
            );
          }

          const event = item;
          return (
            <div key={`event-${i}`} ref={el => { eventsRef.current[i] = el; }}
                 className={`tl-event tl-${event.type}`}>
              <div className="tl-dot-wrap">
                <div className="tl-dot" />
              </div>
              <div className="tl-content">
                <div className="tl-time">{event.time}</div>
                <div className="tl-title">{event.title}</div>
                {event.description && <div className="tl-desc">{event.description}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
