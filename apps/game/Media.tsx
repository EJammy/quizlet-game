
import React, { CSSProperties, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

import {
  CardSide,
  MediaType,
  SerializedMedia,
  SerializedMediaImage,
  SerializedMediaText,
  StudiableItem,
} from 'dataset/types';
import Image from 'next/image';


export interface DragCardProps {
  card: CardSide,
  id: number
}


export function Media({ media }: { media: SerializedMedia }) {
  let IMAGE_HEIGHT = 200;
  let IMAGE_WIDTH = 200;
  if (window.innerWidth < 1200) {
    IMAGE_HEIGHT = 100;
    IMAGE_WIDTH = 100;
  }
  switch (media.type) {
    case MediaType.TEXT:
      const { plainText } = media as SerializedMediaText;
      return <div key={media.type}>{plainText}</div>;
    case MediaType.IMAGE:
      const { url } = media as SerializedMediaImage;
      return (
        <Image
          alt="term image"
          key={media.type}
          src={url}
          height={IMAGE_HEIGHT}
          width={IMAGE_WIDTH}
        />
      );
  }
};
