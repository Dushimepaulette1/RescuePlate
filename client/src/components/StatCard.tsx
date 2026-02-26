import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  index?: number;
  className?: string;
  children?: ReactNode;
}

const StatCard = ({
  icon,
  label,
  value,
  index = 0,
  className = "",
  children,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-primary/50 transition ${className}`}
    >
      {icon && <div className="text-primary mb-4">{icon}</div>}
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {children}
    </motion.div>
  );
};

export default StatCard;
