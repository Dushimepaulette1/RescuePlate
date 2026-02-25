import { Link } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  text?: string;
}

const BackButton = ({ to = "/", text = "Back to Home" }: BackButtonProps) => {
  return (
    <Link
      to={to}
      className="inline-flex items-center text-gray-300 hover:text-primary transition mb-6 group"
    >
      <svg
        className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {text}
    </Link>
  );
};

export default BackButton;
