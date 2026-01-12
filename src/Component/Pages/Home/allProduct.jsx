// CategorySection.jsx
import React, { useMemo } from "react";
import Image1 from "../../Assets/img/allProduct/allproduct1.png";
import Image2 from "../../Assets/img/allProduct/allproduct2.png";
import Image3 from "../../Assets/img/allProduct/allproduct3.png";
import Image4 from "../../Assets/img/allProduct/allproduct4.png";
import Image5 from "../../Assets/img/allProduct/allproduct5.png";
import Image6 from "../../Assets/img/allProduct/allproduct6.png";
import Image7 from "../../Assets/img/allProduct/allproduct7.png";
import Image8 from "../../Assets/img/allProduct/allproduct8.png";

const categories = [
  { name: "New Arrivals", image: Image1, active: true },
  { name: "Ghee", image: Image2 },
  { name: "Flours", image: Image3 },
  { name: "Oils", image: Image4 },
  { name: "Rice", image: Image5 },
  { name: "Pulses", image: Image6 },
  { name: "Seeds", image: Image7 },
  { name: "Dry Fruits", image: Image8 },
];

const CategoryItem = React.memo(({ category }) => (
  <div className="allproduct-item">
    <div className="allproduct-image">
      <img src={category.image} alt={category.name} loading="lazy" />
    </div>
    <p className="allproduct-name mt-1 mb-0">{category.name}</p>
  </div>
));

const Allproduct = () => {
  const categoryElements = useMemo(() => 
    categories.map((category, index) => (
      <CategoryItem key={index} category={category} />
    )), 
  []);

  return (
    <div className="allproduct py-5">
      {categoryElements}
    </div>
  );
};

CategoryItem.displayName = 'CategoryItem';
export default React.memo(Allproduct);
