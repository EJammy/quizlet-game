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
import { Media } from './Media';

export interface DragCardProps {
  card: CardSide,
  id: number
  pos: { x: number, y: number }
  zIndex: number
}

export function DragCard({ card, id, pos, zIndex }: DragCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging, active } = useDraggable({
    id: id,
  });
  const [lastTransform, setLastTransform] = useState(undefined);
  if (transform && transform != lastTransform) {
    setLastTransform(transform);
  }

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 200px)` : undefined,
    zIndex: transform? 200000: zIndex,
    top: pos.y,
    left: pos.x,
  };

  const { sideId, label, media } = card;
  return (
    <div className='drag-card' ref={setNodeRef} style={style} {...listeners} {...attributes}>
    <button className={'drag-card-inner ' + (isDragging ? 'selected' : '')}>
      {media.map(termMedia => <Media media={termMedia} key={termMedia.type} />)}
    </button>
    </div>
  );
}
