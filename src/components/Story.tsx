import React from 'react';

interface StoryProps {
  title: string;
  description: string;
  cta: string;
  imageUrl: string;
}
const Story: React.FC<StoryProps> = ({ title, description, cta, imageUrl }) => {
  return (
    <div
      style={{
        width: '270px',
        height: '480px',
        border: '1px solid black',
        margin: '10px',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center', 
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '20px', 
        boxSizing: 'border-box', 
      }}
      >
      <h1
        style={{
          fontSize: '20px',
          wordWrap: 'break-word',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: '11px',
          wordWrap: 'break-word',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        }}
      >
        {description}
      </p>
      <button>{cta}</button>
    </div>
  );
};

export default Story;
