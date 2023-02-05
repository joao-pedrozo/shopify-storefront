import { useState } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

interface IProps {
  images: Array<{
    __typename?: "ImageEdge";
    node: { __typename?: "Image"; id?: string | null; originalSrc: any };
  }>;
}

const ImageGallery = ({ images }: IProps) => {
  const [currentImage, setCurrentImage] = useState(images[0].node);

  return (
    <div>
      <div className="relative">
        <img
          key={currentImage.id}
          src={currentImage.originalSrc}
          width="500"
          height="500"
        />
        <FaChevronRight
          className="absolute right-0 top-[45%] cursor-pointer"
          size={26}
          onClick={() => {
            const currentIndex = images.findIndex(
              (image) => image.node.id === currentImage.id
            );
            const nextImage = images[currentIndex + 1];

            if (nextImage) {
              setCurrentImage(nextImage.node);
            }
          }}
        />
        <FaChevronLeft
          className="absolute left-0 top-[45%] cursor-pointer"
          size={26}
          onClick={() => {
            const currentIndex = images.findIndex(
              (image) => image.node.id === currentImage.id
            );
            const nextImage = images[currentIndex - 1];

            if (nextImage) {
              setCurrentImage(nextImage.node);
            }
          }}
        />
      </div>
      <div className="flex gap-2 mt-6">
        {images.map((image) => (
          <img
            key={image.node.id}
            src={image.node.originalSrc}
            width="80"
            height="80"
            onClick={() => setCurrentImage(image.node)}
            className={`border-2 p-2 cursor-pointer ${
              image.node.id === currentImage.id
                ? "border-red-500"
                : "border-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
