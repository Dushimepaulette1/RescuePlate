interface CategoryBadgeProps {
  category: "HUMAN" | "ANIMAL";
}

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
        category === "HUMAN"
          ? "bg-green-500/30 text-green-200 border border-green-400/50"
          : "bg-blue-500/30 text-blue-200 border border-blue-400/50"
      }`}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;
