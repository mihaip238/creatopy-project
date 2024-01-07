import React from 'react';

interface InstagramPostProps {
  title: string;
  description: string;
  cta: string;
  imageUrl: string;
}

const InstagramPost: React.FC<InstagramPostProps> = ({
  title,
  description,
  cta,
  imageUrl,
}) => {
  return (
    <div
      style={{
        width: '500px',
        height: '500px',
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
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: '14px',
          wordWrap: 'break-word',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        }}
      >
        {description}
      </p>
      <button>{cta}</button>
    </div>
  );
};

export default InstagramPost;
