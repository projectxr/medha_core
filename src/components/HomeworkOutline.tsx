import React, { useState } from "react";
import Image from "next/image";
import slidesConfig from "./toolsOutputConfig/homeworkSlidesConfig.json";

interface Section {
  label: string;
  type: string;
  value: string;
}

interface Slide {
  slideNumber: number;
  heading: string;
  sections: Section[];
}

const HomeworkOutline: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(slidesConfig.slides);

  const handleInputChange = (
    slideIndex: number,
    sectionIndex: number,
    newValue: string
  ) => {
    const newSlides = [...slides];
    newSlides[slideIndex].sections[sectionIndex].value = newValue;
    setSlides(newSlides);
  };

  return (
    <div>
      <div className="bg-white bg-opacity-60 p-8 rounded-3xl h-[100%] flex flex-col gap-6">
        <div className="flex flex-col mb-4">
          <div className="text-lg font-bold">Outlines</div>
        </div>

        {slides.map((slide, slideIndex) => (
          <div key={slide.slideNumber}>
            <div className="flex justify-between">
              <div className="text-gray-500">
                Slide {slide.slideNumber} : {slide.heading}
              </div>
              <Image
                src="/Checkbox.svg"
                alt="Checkbox"
                width={20}
                height={20}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl w-full h-auto">
              <div className="flex flex-col gap-4 w-full">
                {slide.sections.map((section, sectionIndex) => (
                  <React.Fragment key={`${slideIndex}-${sectionIndex}`}>
                    <div className="flex items-center gap-2">
                      {section.label}
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md h-12"
                        value={section.value}
                        onChange={(e) =>
                          handleInputChange(
                            slideIndex,
                            sectionIndex,
                            e.target.value
                          )
                        }
                      />
                      <button className="bg-transparent px-4 py-2">
                        Navigate
                      </button>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeworkOutline;
