import { motion } from "framer-motion";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6"
    >
      {message}
    </motion.div>
  );
};

export default ErrorAlert;
