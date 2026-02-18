"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";

const ImageGrid = ({ images = [], className = "" }) => {
  const [gridImages, setGridImages] = useState([]);
  const [imageLoadStates, setImageLoadStates] = useState({});

  // Shuffle array utility function
  const shuffleArray = array => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Validate if an image URL can be loaded
  const validateImage = src => {
    return new Promise(resolve => {
      const img = new window.Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  };

  // Fallback colors for when we don't have enough images
  const fallbackColors = [
    "#191E16",
    "#2E312C",
    "#1D211B",
    "#1D241A",
    "#262A21",
    "#1A1F17",
    "#333833",
    "#242821",
    "#1F2419",
  ];

  // Helper function to validate if a string is a valid URL or path
  const isValidImageSrc = src => {
    if (!src || typeof src !== "string") return false;

    // Check if it's a relative path (starts with /)
    if (src.startsWith("/")) return true;

    // Check if it's a valid URL
    try {
      new URL(src);
      return true;
    } catch {
      return false;
    }
  };

  // Generate 9 unique images for the grid with validation
  const generateGridImages = async () => {
    const gridSize = 9;
    const gridImagesList = [];

    if (images.length === 0) {
      // Return 9 color placeholders if no images provided
      return Array(9)
        .fill(null)
        .map((_, index) => ({
          id: `placeholder-${index}`,
          src: null,
          alt: `Placeholder ${index + 1}`,
          isPlaceholder: true,
          fallbackColor: fallbackColors[index],
        }));
    }

    // Filter out invalid images first
    const validImages = images.filter(image => {
      const src = image.src || image;
      return isValidImageSrc(src);
    });

    if (validImages.length === 0) {
      // No valid images, use all fallback colors
      return Array(9)
        .fill(null)
        .map((_, index) => ({
          id: `placeholder-${index}`,
          src: null,
          alt: `Placeholder ${index + 1}`,
          isPlaceholder: true,
          fallbackColor: fallbackColors[index],
        }));
    }

    const shuffledImages = shuffleArray(validImages);

    for (let i = 0; i < gridSize; i++) {
      // Cycle through available valid images
      const imageIndex = i % shuffledImages.length;
      const selectedImage = shuffledImages[imageIndex];
      const imageSrc = selectedImage.src || selectedImage;

      gridImagesList.push({
        id: `${selectedImage.id || imageSrc || imageIndex}-${i}`,
        src: imageSrc,
        alt: selectedImage.alt || `Image ${i + 1}`,
        isPlaceholder: false,
      });
    }

    return gridImagesList;
  };

  // Initialize grid images
  useEffect(() => {
    const loadImages = async () => {
      const newGridImages = await generateGridImages();
      setGridImages(newGridImages);
    };
    loadImages();
  }, [images]);

  // Randomly update images periodically
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(async () => {
      const newGridImages = await generateGridImages();
      setGridImages(newGridImages);
    }, 5000); // Change images every 5 seconds (increased from 3)

    return () => clearInterval(interval);
  }, [images]);

  // Animation variants for each grid item
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: custom => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  const handleImageError = (imageId, index) => {
    setImageLoadStates(prev => ({ ...prev, [imageId]: "error" }));
    // Update the grid image to show fallback color
    setGridImages(prev =>
      prev.map((img, i) =>
        i === index
          ? {
              ...img,
              isPlaceholder: true,
              fallbackColor: fallbackColors[index],
              src: null,
            }
          : img
      )
    );
  };

  const handleImageLoad = imageId => {
    setImageLoadStates(prev => ({ ...prev, [imageId]: "loaded" }));
  };

  const Placeholder = ({ image }) => (
    <div
      className="w-full h-full flex items-center justify-center absolute inset-0"
      style={{ backgroundColor: image.fallbackColor || "#191E16" }}
    >
      <div className="w-6 h-6 bg-white rounded opacity-10"></div>
    </div>
  );

  return (
    <div className={`grid grid-cols-3 grid-rows-3 w-full aspect-square gap-0 ${className}`}>
      {gridImages.map((image, index) => (
        <motion.div
          key={image.id}
          custom={index}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="relative overflow-hidden cursor-pointer my-component"
        >
          {image.isPlaceholder || !image.src || !isValidImageSrc(image.src) ? (
            <Placeholder image={image} />
          ) : (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
              quality={90}
              onLoad={() => handleImageLoad(image.id)}
              onError={() => handleImageError(image.id, index)}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ImageGrid;
