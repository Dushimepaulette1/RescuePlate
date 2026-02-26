import { motion } from "framer-motion";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-red-600 font-bold px-4 py-3 mb-6"
    >
      {message}
    </motion.div>
  );
};

export default ErrorAlert;
