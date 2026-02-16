'use client';

import { useRef, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  onLongPress?: () => void;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function SwipeableCard({
  children,
  onSwipeRight,
  onSwipeLeft,
  onLongPress,
  onClick,
  className = '',
  disabled = false,
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  // Transform x position to background colors
  const rightBgOpacity = useTransform(x, [0, 100], [0, 1]);
  const leftBgOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDragStart = () => {
    setIsDragging(true);
    dragStartPos.current = { x: x.get(), y: 0 };
  };

  const handleDrag = () => {
    // Clear long press timer when dragging
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const swipeThreshold = window.innerWidth * 0.15; // 15% of screen width

    if (info.offset.x > swipeThreshold && onSwipeRight) {
      // Swipe right - complete
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
      onSwipeRight();
    } else if (info.offset.x < -swipeThreshold && onSwipeLeft) {
      // Swipe left - delete
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
      onSwipeLeft();
    } else if (Math.abs(info.offset.x) < 10 && Math.abs(info.offset.y) < 10 && onClick) {
      // Click detected - no significant drag movement
      // Threshold increased from 5px to 10px to improve click detection reliability
      onClick();
    }

    // Reset position
    x.set(0);
    dragStartPos.current = null;
  };

  const handleLongPressStart = () => {
    if (!disabled && onLongPress) {
      const timer = setTimeout(() => {
        if (!isDragging) {
          onLongPress();
          // Haptic feedback
          if ('vibrate' in navigator) {
            navigator.vibrate(10);
          }
        }
      }, 500) as unknown as number;
      setLongPressTimer(timer);
    }
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background indicators */}
      {onSwipeRight && (
        <motion.div
          style={{ opacity: rightBgOpacity }}
          className="absolute left-0 top-0 bottom-0 w-24 bg-success-500 flex items-center justify-start pl-4"
        >
          <Check className="w-6 h-6 text-white" />
        </motion.div>
      )}
      {onSwipeLeft && (
        <motion.div
          style={{ opacity: leftBgOpacity }}
          className="absolute right-0 top-0 bottom-0 w-24 bg-red-500 flex items-center justify-end pr-4"
        >
          <Trash2 className="w-6 h-6 text-white" />
        </motion.div>
      )}

      {/* Swipeable content */}
      <motion.div
        ref={cardRef}
        drag={!disabled ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`relative bg-white dark:bg-[#1C1C1E] ${className}`}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
      >
        {children}
      </motion.div>
    </div>
  );
}
