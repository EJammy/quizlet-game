
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

const IMAGE_HEIGHT = 100;
const IMAGE_WIDTH = 120;

export function Media({ media }: { media: SerializedMedia }) {
  switch (media.type) {
    case MediaType.TEXT:
      const { plainText } = media as SerializedMediaText;
      return <div key={media.type}>{plainText}</div>;
    case MediaType.IMAGE:
      const { url } = media as SerializedMediaImage;
      return (
        <Image
          alt="term image"
          height={IMAGE_HEIGHT}
          key={media.type}
          src={url}
          width={IMAGE_WIDTH}
        />
      );
  }
};
