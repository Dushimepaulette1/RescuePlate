interface TextAreaProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
  labelClassName?: string;
}

const TextArea = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  className = "",
  labelClassName = "",
}: TextAreaProps) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium text-gray-200 mb-2 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400 transition resize-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextArea;
