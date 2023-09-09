import React, {useState} from 'react';
import {DndContext} from '@dnd-kit/core';

import {Droppable} from './Droppable';
import {Draggable} from './Draggable';

export default function Game() {
  
  return (
    <DndContext>
      <Draggable>Drag me</Draggable>
      <Droppable>
      </Droppable>
    </DndContext>
  );
  
}
