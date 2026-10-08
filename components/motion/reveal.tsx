"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.6,
  once = true,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "span" | "li";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: DEFAULT_EASE }}
      className={className}
    >
      {children}
    </Comp>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: DEFAULT_EASE },
  },
};

export function Stagger({
  children,
  className,
  itemClassName,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? { opacity: 0 } : "hidden"}
      whileInView={reduce ? { opacity: 1 } : "show"}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={reduce ? undefined : staggerItem}
              className={itemClassName}
            >
              {child}
            </motion.div>
          ))
        : <motion.div variants={reduce ? undefined : staggerItem}>{children}</motion.div>}
    </motion.div>
  );
}

export function FadeIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: DEFAULT_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleOnHover({
  children,
  className,
  scale = 1.03,
  duration = 0.6,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : "hover"}
      variants={{ rest: {}, hover: { transition: { staggerChildren: 0 } } }}
    >
      <motion.div
        variants={{ rest: { scale: 1 }, hover: { scale } }}
        transition={{ duration, ease: DEFAULT_EASE }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
