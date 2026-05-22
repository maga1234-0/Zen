import { motion } from 'framer-motion';

interface AIIconProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export const AIIcon = ({ size = 24, className = '', animate = true }: AIIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="aiGradientAlt" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* Brain outline */}
      <motion.path
        d="M12 2C10.5 2 9.2 2.6 8.3 3.5C7.4 2.6 6.1 2 4.6 2C2.1 2 0 4.1 0 6.6C0 7.4 0.2 8.1 0.5 8.8C0.2 9.5 0 10.3 0 11.1C0 13.6 2.1 15.7 4.6 15.7C5.1 15.7 5.6 15.6 6 15.4C6.4 16.9 7.7 18 9.3 18C9.8 18 10.3 17.9 10.7 17.7C11.1 19.2 12.4 20.3 14 20.3C15.6 20.3 16.9 19.2 17.3 17.7C17.7 17.9 18.2 18 18.7 18C20.3 18 21.6 16.9 22 15.4C22.4 15.6 22.9 15.7 23.4 15.7C25.9 15.7 28 13.6 28 11.1C28 10.3 27.8 9.5 27.5 8.8C27.8 8.1 28 7.4 28 6.6C28 4.1 25.9 2 23.4 2C21.9 2 20.6 2.6 19.7 3.5C18.8 2.6 17.5 2 16 2"
        stroke="url(#aiGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Neural network nodes */}
      <motion.circle
        cx="8"
        cy="8"
        r="1.5"
        fill="url(#aiGradient)"
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.3 }}
      />
      <motion.circle
        cx="12"
        cy="6"
        r="1.5"
        fill="url(#aiGradientAlt)"
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.3 }}
      />
      <motion.circle
        cx="16"
        cy="8"
        r="1.5"
        fill="url(#aiGradient)"
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.3 }}
      />
      <motion.circle
        cx="8"
        cy="14"
        r="1.5"
        fill="url(#aiGradientAlt)"
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.3 }}
      />
      <motion.circle
        cx="12"
        cy="16"
        r="1.5"
        fill="url(#aiGradient)"
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.3 }}
      />
      <motion.circle
        cx="16"
        cy="14"
        r="1.5"
        fill="url(#aiGradientAlt)"
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.3 }}
      />

      {/* Neural connections */}
      <motion.line
        x1="8"
        y1="8"
        x2="12"
        y2="6"
        stroke="url(#aiGradient)"
        strokeWidth="1"
        strokeOpacity="0.5"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 0.5 } : {}}
        transition={{ delay: 1.1, duration: 0.3 }}
      />
      <motion.line
        x1="12"
        y1="6"
        x2="16"
        y2="8"
        stroke="url(#aiGradient)"
        strokeWidth="1"
        strokeOpacity="0.5"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 0.5 } : {}}
        transition={{ delay: 1.2, duration: 0.3 }}
      />
      <motion.line
        x1="8"
        y1="8"
        x2="8"
        y2="14"
        stroke="url(#aiGradient)"
        strokeWidth="1"
        strokeOpacity="0.5"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 0.5 } : {}}
        transition={{ delay: 1.3, duration: 0.3 }}
      />
      <motion.line
        x1="16"
        y1="8"
        x2="16"
        y2="14"
        stroke="url(#aiGradient)"
        strokeWidth="1"
        strokeOpacity="0.5"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 0.5 } : {}}
        transition={{ delay: 1.4, duration: 0.3 }}
      />
      <motion.line
        x1="8"
        y1="14"
        x2="12"
        y2="16"
        stroke="url(#aiGradient)"
        strokeWidth="1"
        strokeOpacity="0.5"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 0.5 } : {}}
        transition={{ delay: 1.5, duration: 0.3 }}
      />
      <motion.line
        x1="12"
        y1="16"
        x2="16"
        y2="14"
        stroke="url(#aiGradient)"
        strokeWidth="1"
        strokeOpacity="0.5"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 0.5 } : {}}
        transition={{ delay: 1.6, duration: 0.3 }}
      />

      {/* Sparkle effect */}
      {animate && (
        <>
          <motion.path
            d="M18 4L18.5 5.5L20 6L18.5 6.5L18 8L17.5 6.5L16 6L17.5 5.5L18 4Z"
            fill="url(#aiGradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ delay: 2, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          />
          <motion.path
            d="M6 18L6.3 19L7 19.3L6.3 19.6L6 20.5L5.7 19.6L5 19.3L5.7 19L6 18Z"
            fill="url(#aiGradientAlt)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ delay: 2.5, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          />
        </>
      )}
    </svg>
  );
};

// Simpler version for smaller sizes
export const AIIconSimple = ({ size = 20, className = '' }: AIIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="aiGradientSimple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Brain shape */}
      <path
        d="M12 3C9.5 3 7.5 5 7.5 7.5C7.5 8 7.6 8.5 7.8 9C7.3 9.5 7 10.2 7 11C7 12.7 8.3 14 10 14C10.3 14 10.6 14 10.9 13.9C11.2 15.2 12.4 16 13.8 16C15.2 16 16.4 15.2 16.7 13.9C17 14 17.3 14 17.6 14C19.3 14 20.6 12.7 20.6 11C20.6 10.2 20.3 9.5 19.8 9C20 8.5 20.1 8 20.1 7.5C20.1 5 18.1 3 15.6 3C14.5 3 13.5 3.4 12.8 4.1C12.1 3.4 11.1 3 10 3"
        stroke="url(#aiGradientSimple)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Neural nodes */}
      <circle cx="10" cy="9" r="1.2" fill="url(#aiGradientSimple)" />
      <circle cx="14" cy="9" r="1.2" fill="url(#aiGradientSimple)" />
      <circle cx="12" cy="12" r="1.2" fill="url(#aiGradientSimple)" />

      {/* Connections */}
      <line x1="10" y1="9" x2="12" y2="12" stroke="url(#aiGradientSimple)" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="14" y1="9" x2="12" y2="12" stroke="url(#aiGradientSimple)" strokeWidth="0.8" strokeOpacity="0.5" />
    </svg>
  );
};

export default AIIcon;
