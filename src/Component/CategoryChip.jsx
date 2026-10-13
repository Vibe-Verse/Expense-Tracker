import React from "react";
import { getCategoryMeta } from "../constants";
import "./CategoryChip.css";

const CategoryChip = ({ category, size = "md" }) => {
  const meta = getCategoryMeta(category);
  return (
    <span
      className={`category-chip category-chip--${size}`}
      style={{ "--chip-color": meta.color }}
    >
      <span className="category-chip__icon">{meta.icon}</span>
      {meta.label}
    </span>
  );
};

export default CategoryChip;
