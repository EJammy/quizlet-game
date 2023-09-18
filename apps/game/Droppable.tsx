import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CardSide, MediaType, SerializedMediaText } from 'dataset/types';
import { Media } from './Media';

export interface DropTarget {
  card: CardSide,
  id: number;
  fade;
}

export function DropCard({ card, id, fade }: DropTarget) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const { label, media } = card;

  const text = media.find(x => x.type == MediaType.TEXT) as SerializedMediaText;
  const image = media.find(x => x.type == MediaType.IMAGE);

  const size = text.plainText.length + (image ? 100: 0);
  const className = 'drop-card '
    + (isOver ? 'selected ' : '')
    + (size > 180 ? 'smaller-text ' : '')
    + (fade ? 'fade ': '');

  return (
    <div ref={setNodeRef} className={className} key={id}>
       {media.map(termMedia => <Media media={termMedia} key={termMedia.type}/>)}
    </div>
  );
}
