import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  type: 'opening' | 'hackbegins' | 'workshop' | 'meal' | 'checkpoint' | 'closing';
}

const day1Events: TimelineEvent[] = [
  { time: '09:00 AM', title: 'Registration Opens', description: 'Check-in and kit collection', type: 'opening' },
  { time: '10:00 AM', title: 'Inauguration Ceremony', description: 'Opening keynote + rules brief', type: 'opening' },
  { time: '11:00 AM', title: 'HACK BEGINS', description: '48-hour countdown starts NOW', type: 'hackbegins' },
  { time: '01:00 PM', title: 'Lunch Break', description: 'Fuel up — keep building', type: 'meal' },
  { time: '03:00 PM', title: 'Workshop: AI/ML', description: 'Mentor-led session', type: 'workshop' },
  { time: '06:00 PM', title: 'Checkpoint 1', description: 'Progress review with mentors', type: 'checkpoint' },
  { time: '08:00 PM', title: 'Dinner', description: '', type: 'meal' },
  { time: '11:59 PM', title: 'Day 1 Ends', description: 'Keep going. Night is young.', type: 'checkpoint' },
];

const day2Events: TimelineEvent[] = [
  { time: '01:00 AM', title: 'Midnight Snacks', description: 'Midnight refuel station', type: 'meal' },
  { time: '06:00 AM', title: 'Morning Check-in', description: 'Sunrise. Still coding.', type: 'checkpoint' },
  { time: '08:00 AM', title: 'Breakfast', description: '', type: 'meal' },
  { time: '10:00 AM', title: 'Final Checkpoint', description: 'Last mentor round', type: 'checkpoint' },
  { time: '11:00 AM', title: 'SUBMISSIONS CLOSE', description: 'Freeze your code', type: 'hackbegins' },
  { time: '12:00 PM', title: 'Project Presentations', description: 'Demo to judges', type: 'opening' },
  { time: '03:00 PM', title: 'Judging Deliberation', description: 'Results computed...', type: 'checkpoint' },
  { time: '04:00 PM', title: 'CLOSING CEREMONY', description: 'Winners announced. Glory.', type: 'closing' },
];

export const MobileTimeline: React.FC = () => {
  const [activeDay, setActiveDay] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<(HTMLDivElement | null)[]>([]);

  const currentEvents = activeDay === 1 ? day1Events : day2Events;

  const animateEvents = () => {
    gsap.to('.tl-spine', {
      height: '100%',
      duration: 1.2,
      ease: 'power2.inOut'
    });
    gsap.to('.tl-event', {
      opacity: 1,
      x: 0,
      stagger: 0.07,
      duration: 0.4,
      ease: 'power2.out'
    });
    gsap.fromTo('.tl-dot',
      { scale: 0 },
      { scale: 1, stagger: 0.07, duration: 0.3, ease: 'back.out(2)', delay: 0.1 }
    );
  };

  const switchDay = (day: number) => {
    if (day === activeDay) return;
    
    gsap.to('.tl-event', {
      opacity: 0,
      x: -20,
      stagger: 0.04,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setActiveDay(day);
        setTimeout(() => animateEvents(), 50);
      }
    });
    gsap.to('.tl-spine', { height: '0%', duration: 0.3 });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main section transitions
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
      <h2 className="section-heading">
        <span className="word">24H</span>{' '}
        <span className="word">SCHEDULE</span>
      </h2>

      <div className="day-tabs section-body">
        <button className={`day-tab ${activeDay === 1 ? 'active' : ''}`} onClick={() => switchDay(1)}>
          DAY 01
        </button>
        <button className={`day-tab ${activeDay === 2 ? 'active' : ''}`} onClick={() => switchDay(2)}>
          DAY 02
        </button>
      </div>

      <div ref={trackRef} className="timeline-track section-body">
        <div className="tl-spine" />
        {currentEvents.map((event, i) => (
          <div key={`${activeDay}-${i}`} ref={el => { eventsRef.current[i] = el; }}
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
        ))}
      </div>
    </section>
  );
};
