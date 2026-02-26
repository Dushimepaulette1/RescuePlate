interface ContactInfoItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

const ContactInfoItem = ({ icon, label, href }: ContactInfoItemProps) => {
  const content = (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-white font-medium">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="hover:text-primary transition"
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return content;
};

export default ContactInfoItem;
