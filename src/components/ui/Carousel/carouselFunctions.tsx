export const onTouchStart = (e: any, touchStart: React.MutableRefObject<any>, touchEnd: React.MutableRefObject<any>) => {
  touchEnd.current = null;
  touchStart.current = e.targetTouches[0].clientX;
};

export const onTouchEnd = (touchStart?: React.MutableRefObject<any>, touchEnd?: React.MutableRefObject<any>) => {
  if (!touchStart?.current || !touchEnd?.current) return;
  const distance = touchStart?.current - touchEnd?.current;
  const isLeftSwipe = distance > 100;
  const isRightSwipe = distance < -100;
  if (isLeftSwipe || isRightSwipe) {
    return isRightSwipe ? 'prev' : 'next';
  }
  return ""
};

export const onTouchMove = (e: any, touchEnd: React.MutableRefObject<any>) => {
  touchEnd.current = e.targetTouches[0].clientX;
};

type SliderProps = {
  dir: string | undefined,
  scrollRef: React.MutableRefObject<any>,
  carouselRef: React.MutableRefObject<any>,
  sliding: React.MutableRefObject<boolean>,
  setSlidingDir: React.Dispatch<React.SetStateAction<any>>,
  children: any[],
  setChildren: React.Dispatch<React.SetStateAction<any[]>>,
  infinite?: boolean,
}

export const slider = ({
  dir,
  scrollRef,
  carouselRef,
  sliding,
  setSlidingDir,
  children,
  setChildren,
}: SliderProps) => {
  if (dir && (scrollRef.current || carouselRef.current)) {
    const carousel: any = carouselRef.current;
    const container: any = scrollRef.current;
    let newChildren = [...children];
    
    if (carousel.offsetWidth < container.scrollWidth) {
      if (!sliding.current) {
        setSlidingDir(dir);
        sliding.current = true;
        if (dir === 'prev') {                       
          const current = newChildren[newChildren.length - 1];
          const sliced = (newChildren || []).slice(0, -1);
          newChildren = [current, ...sliced];                        
          setChildren(newChildren); 
          setTimeout(() => {                    
            setSlidingDir(false);
            sliding.current = false;
          }, 500);                    
        } else {
          const current = newChildren[0];             
          newChildren = (newChildren || []).slice(1);
          newChildren.push(current);             
          setTimeout(() => {  
            setChildren(newChildren);     
            setSlidingDir(false);
            sliding.current = false;
          }, 500);                    
        }                              
      }
    }      
  }
};
