import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CardSide, MediaType, SerializedMediaText } from 'dataset/types';
import { Media } from './Media';
import { dir } from 'console';

export interface DropCardProps {
  card: CardSide,
  id: number;
  wrongAnswer: boolean;
}

export function DropCard({ card, id, wrongAnswer }: DropCardProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const { label, media } = card;

  const text = media.find(x => x.type == MediaType.TEXT) as SerializedMediaText;
  const image = media.find(x => x.type == MediaType.IMAGE);

  const size = text.plainText.length + (image ? 80: 0);
  const className = 'drop-card '
    + (isOver ? 'selected ' : '')
  const classNameInner = 'drop-card-inner '
    + (wrongAnswer ? 'drop-card-wrong ': '')
    + (size > 240 ? 'smaller-text ' : '');

  return (
    <div className={className}>
      <div ref={setNodeRef} className={classNameInner} key={id}>
        {media.map(termMedia => <Media media={termMedia} smaller={size > 240} key={termMedia.type} />)}
      </div>
    </div>
  );
}
