const API_KEY = process.env.REACT_APP_OPENAI_API;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/engines/davinci/completions';
const OPENAI_IMAGE_ENDPOINT = 'https://api.openai.com/v1/images/generations';

export const generateImage = async (
  title: string,
  description: string,
  colors: string[]
) => {
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };
  const colorDescription = colors.map((color) => `color ${color}`).join(', ');
  const imagePrompt = `Create a minimalist ad image with the colors: ${colorDescription}, and based on the title: '${title}' and the description: '${description}'`;

  const data = {
    prompt: imagePrompt,
    model: 'dall-e-3',
    size: '1024x1024',
    quality: 'standard',
    n: 1,
    style: 'vivid',
  };

  try {
    const response = await fetch(OPENAI_IMAGE_ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error calling OpenAI Image API:', error);
    throw error;
  }
};

export const generateAdContent = async (
  input: string,
  contentType: 'title' | 'description'
) => {
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };
  let prompt = '';
  if (contentType === 'title') {
    prompt = `Create a catchy title up to 6 words for a ${input} ad featuring key features and benefits.`;
  } else if (contentType === 'description') {
    prompt = `Write a concise, engaging description suitable for a ${input} ad, focusing on unique features and benefits.`;
  }

  const data = {
    prompt: prompt,
    max_tokens: 100,
  };

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

export const generateCTA = async (input: string) => {
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };

  const prompt = `Generate a compelling call to action for a ${input} ad that motivates customers to take immediate action.`;

  const data = {
    prompt: prompt,
    max_tokens: 60,
  };

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling OpenAI API for CTA:', error);
    throw error;
  }
};

export const processUploadedImage = async (image: File) => {
  const base64Image = await convertToBase64(image);

  const response = await fetch(OPENAI_IMAGE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
