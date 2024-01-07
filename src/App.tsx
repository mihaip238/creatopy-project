import React, { FC, useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import useOutsideClick from './useOutsideClick';
import './App.css';
import Configuration from 'openai';
import OpenAIApi from 'openai';
import InstagramPost from './components/InstagramPost';
import TwitterHeader from './components/TwitterHeader';
import Story from './components/Story';
import { generateAdContent, generateImage, generateCTA } from './OpenAiService';

export const App: FC<{ name: string }> = ({ name }) => {
  const [description, setDescription] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adCTA, setAdCTA] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('instagram');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [color1, setColor1] = useState('#FFFFFF');
  const [color2, setColor2] = useState('#FFFFFF');
  const [color3, setColor3] = useState('#FFFFFF');
  const [showColorPicker1, setShowColorPicker1] = useState(false);
  const [showColorPicker2, setShowColorPicker2] = useState(false);
  const [showColorPicker3, setShowColorPicker3] = useState(false);
  const colorPickerRef1 = useRef<HTMLDivElement>(null);
  const colorPickerRef2 = useRef<HTMLDivElement>(null);
  const colorPickerRef3 = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useOutsideClick(colorPickerRef1, () => setShowColorPicker1(false));
  useOutsideClick(colorPickerRef2, () => setShowColorPicker2(false));
  useOutsideClick(colorPickerRef3, () => setShowColorPicker3(false));

  const toggleColorPicker1 = () => setShowColorPicker1(!showColorPicker1);
  const toggleColorPicker2 = () => setShowColorPicker2(!showColorPicker2);
  const toggleColorPicker3 = () => setShowColorPicker3(!showColorPicker3);

  const goToNextStep = () => setCurrentStep(currentStep + 1);
  const goToPreviousStep = () => setCurrentStep(currentStep - 1);

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };
  const limitWords = (text, wordLimit) => {
    return text.split(' ').slice(0, wordLimit).join(' ');
  };

  const handleGenerateClick = async () => {
    setIsLoading(true); 
    try {
      const titleResponse = await generateAdContent(description, 'title');
      const generatedTitle =
        titleResponse.choices[0]?.text.trim() || 'Default Title';
      setAdTitle(limitWords(generatedTitle, 5)); 

      const descriptionResponse = await generateAdContent(
        description,
        'description'
      );
      const generatedDescription =
        descriptionResponse.choices[0]?.text.trim() || 'Default Description';
      setAdDescription(limitWords(generatedDescription, 20)); 
      const ctaResponse = await generateCTA(description);
      const generatedCTA = ctaResponse.choices[0]?.text.trim() || 'Click Here';
      setAdCTA(generatedCTA);
      const imageResponse = await generateImage(adTitle, adDescription, [
        color1,
        color2,
        color3,
      ]);
      if (imageResponse.data && imageResponse.data.length > 0) {
        setGeneratedImageUrl(imageResponse.data[0].url);
      }

      setIsLoading(false); 
    } catch (error) {
      console.error('Failed to generate ad content:', error);
      setIsLoading(false); 
    }
  };
  const resetAndGoToScreen2 = () => {
    setDescription('');
    setAdTitle('');
    setAdDescription('');
    setAdCTA('');
    setGeneratedImageUrl('');
    setCurrentStep(2);
  };

  return (
    <div className="App">
      {currentStep === 1 && (
        <div className="welcome-container">
          <img
            className="logo"
            src="https://strategyinsights.eu/wp-content/uploads/2021/12/creatopy-logo.png"
            alt="Logo"
            style={{ width: '400px', height: 'auto' }}
          />
          <h1 className="welcome-text">Welcome to the Ad Generator</h1>
          <button className="button" onClick={() => setCurrentStep(2)}>
            Get Started
          </button>
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <h1>Please insert your input for the ad</h1>
          <div className="input-button-container">
            <input
              type="text"
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="small-button" onClick={handleGenerateClick}>
              Generate
            </button>
          </div>

          <div>
            <h3>Select Colors for the Ad:</h3>
            <div className="color-picker-container">
              <div ref={colorPickerRef1}>
                <button
                  className="color-picker-trigger"
                  style={{ backgroundColor: color1 }}
                  onClick={toggleColorPicker1}
                ></button>
                {showColorPicker1 && (
                  <SketchPicker
                    color={color1}
                    onChangeComplete={(color) => setColor1(color.hex)}
                  />
                )}
              </div>

              <div ref={colorPickerRef2}>
                <button
                  className="color-picker-trigger"
                  style={{ backgroundColor: color2 }}
                  onClick={toggleColorPicker2}
                ></button>
                {showColorPicker2 && (
                  <SketchPicker
                    color={color2}
                    onChangeComplete={(color) => setColor2(color.hex)}
                  />
                )}
              </div>

              <div ref={colorPickerRef3}>
                <button
                  className="color-picker-trigger"
                  style={{ backgroundColor: color3 }}
                  onClick={toggleColorPicker3}
                ></button>
                {showColorPicker3 && (
                  <SketchPicker
                    color={color3}
                    onChangeComplete={(color) => setColor3(color.hex)}
                  />
                )}
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <>
              {generatedImageUrl && (
                <div>
                  <button className="button" onClick={() => setCurrentStep(3)}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
          <button className="small-button" onClick={() => setCurrentStep(1)}>
            Back
          </button>
        </div>
      )}
      {currentStep === 3 && (
        <div>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <option value="instagram">Instagram Post</option>
            <option value="twitter">Twitter Header</option>
            <option value="story">Story</option>
          </select>
          {selectedTemplate === 'instagram' && (
            <InstagramPost
              title={adTitle}
              description={adDescription}
              cta={adCTA}
              imageUrl={generatedImageUrl}
            />
          )}
          {selectedTemplate === 'twitter' && (
            <TwitterHeader
              title={adTitle}
              description={adDescription}
              cta={adCTA}
              imageUrl={generatedImageUrl}
            />
          )}
          {selectedTemplate === 'story' && (
            <Story
              title={adTitle}
              description={adDescription}
              cta={adCTA}
              imageUrl={generatedImageUrl}
            />
          )}
          <button className = "button" onClick={resetAndGoToScreen2}>Generate Again</button>
          <button className = "small-button" onClick={() => setCurrentStep(2)}>Back</button>
        </div>
      )}
    </div>
  );
};
