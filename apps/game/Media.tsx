
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


export function Media({ media, smaller }: { media: SerializedMedia, smaller: boolean }) {
  switch (media.type) {
    case MediaType.TEXT:
      const { plainText } = media as SerializedMediaText;
      return <div key={media.type}>{plainText}</div>;
    case MediaType.IMAGE:
      const { url } = media as SerializedMediaImage;
      return (
        <div key={media.type} className={'image-container ' + (smaller ? 'smaller-image' : '')}>
          <Image
            alt="term image"
            src={url}
            fill={true}
            className="image"
          // height={IMAGE_HEIGHT}
          // width={IMAGE_WIDTH}
          />
        </div>
      );
  }
};
