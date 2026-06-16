import React from 'react';

// Placeholder for sunlight intensity slider (controls --sun-intensity CSS var)
export default function SunlightSlider() {
  return (
    <div className="flex flex-col items-center mt-8 mb-4">
      <label htmlFor="sunlight-slider" className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
        Sunlight Intensity
      </label>
      <input
        id="sunlight-slider"
        type="range"
        min={0}
        max={100}
        defaultValue={60}
        className="w-64 accent-yellow-400"
        // TODO: Wire to CSS variable and animate background/plant growth
      />
    </div>
  );
}
