import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CardSide } from 'dataset/types';
import { Media } from './Media';

export interface DropTarget {
  card: CardSide,
  id: number;
}


export function Droppable({ card, id }: DropTarget) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  const { sideId, label, media } = card;
  return (
    <div ref={setNodeRef} className='dropzone' style={style} key={id}>
       : {id}: {label}: {media.map(termMedia => <Media media={termMedia} key={termMedia.type}/>)}
    </div>
  );
}
