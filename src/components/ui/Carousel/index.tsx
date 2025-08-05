"use client";

import React, { useEffect } from 'react';
import styles from './styles.module.css';
import { slider, onTouchStart, onTouchEnd, onTouchMove } from './carouselFunctions';

export default function Carousel({ 
  items,
  columns,
  className,
  toggleStyle,
  activeIndex = -1,
} : {
  items: any[];
  columns?: 1 | number;
  className?: string;  
  toggleStyle?: 'centercenter' | 'bottomcenter' | 'bottomspaced';
  activeIndex?: number;
}) {  
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sliding = React.useRef<boolean>(false);  
  const touchStart = React.useRef<any>(null);
  const touchEnd = React.useRef<any>(null);

  const [slidingDir, setSlidingDir] = React.useState<any>(false);
  const [children, setChildren] = React.useState<any[]>([]);
  const [showToggles,setShowToggles] = React.useState<any>(true);

  const moveCarousel = (dir?: string) => {
    slider({ dir: dir ?? 'next', scrollRef, carouselRef, sliding, setSlidingDir, children, setChildren });
  }

  const checkToggleVisibility = () => {
    if (!carouselRef.current || !scrollRef.current) return;

    const items = scrollRef.current.childNodes;
    let totalWidth = 0;
    items.forEach((item) => {
      const rect = (item as HTMLElement).getBoundingClientRect();
      totalWidth += rect.width;
    });

    const visibleWidth = carouselRef.current.getBoundingClientRect().width;

    setShowToggles(totalWidth > visibleWidth);
  };

  useEffect(() => {    
    const index = activeIndex ?? 0;
    const total = items.length;
    const center = Math.floor(total / 2);
    let offset = index - center;
    if (offset < 0) {
      offset = total + offset; // wrap negative offsets
    }

    const rotated = [...items.slice(offset), ...items.slice(0, offset)];
    const newChilds = rotated.map((element: React.ReactElement) => (
      <div className={styles.carouselItem} key={element.key}>
        {element}
      </div>
    ));
            
    setChildren(newChilds);  
  }, [items]);

  useEffect(() => {
    if(scrollRef.current){
      checkToggleVisibility();
    }   
  }, [items, scrollRef.current]);

  return (
    <div className={[styles.carouselWrapper,showToggles ? styles[`toggles-${toggleStyle ?? 'bottomspaced'}`] : ""].filter(Boolean).join(" ")}>
      <div 
        ref={carouselRef} 
        className={[styles.carousel, className].filter((i) => i).join(' ')}
      >        
        <div 
          ref={scrollRef}         
          className={[styles.carouselInner, slidingDir ? ((slidingDir === 'prev') ? styles.carouselMoveRight : styles.carouselMoveLeft) : ''].filter((i) => i).join(' ')}
          onTouchStart={(e) => onTouchStart(e, touchStart, touchEnd)}
          onTouchMove={(e) => onTouchMove(e, touchEnd)}
          onTouchEnd={() => moveCarousel(onTouchEnd(touchStart, touchEnd))}
          data-columns={columns || 3}
        >
          {children ?? []}
        </div>                                
      </div>
      {showToggles && (
        <div className={[styles.toggles, toggleStyle || 'bottomspaced'].filter((i) => i).join(' ')}>
          <span className={styles.togglePrev} onClick={() => moveCarousel('prev')}>&lt;</span>
          <span className={styles.toggleNext} onClick={() => moveCarousel('next')}>&gt;</span>
        </div>          
      )}
    </div>
  );
}
