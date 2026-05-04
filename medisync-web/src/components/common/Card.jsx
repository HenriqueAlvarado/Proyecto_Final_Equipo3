import React from 'react';
import './Card.css';

const Card = ({ children, title, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {title && <h2 className="card__title">{title}</h2>}
      <div className="card__body">{children}</div>
    </div>
  );
};

export default Card;
