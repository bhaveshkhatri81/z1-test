// src/components/ImageUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [customSize, setCustomSize] = useState({ width: 300, height: 250 });
  const [selectedSize, setSelectedSize] = useState(null);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const predefinedSizes = [
    { width: 300, height: 250 },
    { width: 728, height: 90 },
    { width: 160, height: 600 },
    { width: 300, height: 600 },
  ];

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);
    const sizes = useCustomSize ? [customSize] : [selectedSize];
    formData.append('sizes', JSON.stringify(sizes));
    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(response.data.image_urls[0]);
    } catch (error) {
      alert(`Error: ${error.response.data.error}`);
    }
  };

  const postOnTwitter = (url) => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=Check+out+this+awesome+image!&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank');
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <div>
        <label>
          <input
            type="radio"
            checked={!useCustomSize}
            onChange={() => {
              setUseCustomSize(false);
              setSelectedSize(predefinedSizes[0]);
            }}
          />
          Use predefined sizes
        </label>
        {!useCustomSize && (
          <div>
            {predefinedSizes.map((size, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`size-${index}`}
                  name="predefinedSize"
                  checked={selectedSize === size}
                  onChange={() => setSelectedSize(size)}
                />
                <label htmlFor={`size-${index}`}>{`Width: ${size.width}, Height: ${size.height}`}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <label>
          <input
            type="radio"
            checked={useCustomSize}
            onChange={() => setUseCustomSize(true)}
          />
          Use custom size
        </label>
        {useCustomSize && (
          <div>
            <input
              type="number"
              value={customSize.width}
              onChange={(e) => setCustomSize({ ...customSize, width: parseInt(e.target.value) })}
              placeholder="Width"
            />
            <input
              type="number"
              value={customSize.height}
              onChange={(e) => setCustomSize({ ...customSize, height: parseInt(e.target.value) })}
              placeholder="Height"
            />
          </div>
        )}
      </div>
      <button onClick={handleUpload}>Upload</button>
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Resized" />
          <button onClick={() => postOnTwitter(imageUrl)}>Post on Twitter</button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;