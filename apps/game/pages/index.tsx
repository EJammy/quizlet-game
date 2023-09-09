import Quizlet from 'dataset';
import Fun from 'dataset/sets/Fun';
import Science from 'dataset/sets/Science';
import Language from 'dataset/sets/Language';

import { closestCenter, DndContext, rectIntersection } from '@dnd-kit/core';

import { DragCard, DragCardProps } from './Draggable';
import { Droppable } from './Droppable';
import { useEffect, useState } from 'react';


export default function Game() {
  // to get a specific Set

  // const quizletSet = Fun.getAllSetsMap().jokes;
  const quizletSet = Language.getAllSetsMap().chineseFood;

  // const [quizletSet, setQuizletSet] = useState(undefined);
  // useEffect(() => setQuizletSet(Quizlet.getRandomSet()), []);

  if (!quizletSet) return null;

  const initCards = () => quizletSet.studiableItem.map(
    (item) => { return { card: item.cardSides[0], id: item.id } }
  )

  const initDrop = () => quizletSet.studiableItem.map(
    (item) => { return { card: item.cardSides[1], id: item.id } }
  )

  const [dragCards, setDragCards] = useState(initCards());
  const [dropTarget, setDropTarget] = useState(initDrop());
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h1>Your game title here!</h1>
      <h2>Set used: {quizletSet.set.title}</h2>
      <DndContext
        onDragStart={(event) => {
          setSelected(event.active.id)
        }}
        onDragEnd={(event) => {
          console.log(selected, "::: ", event.over?.id)
        }}
        collisionDetection={rectIntersection}>
        {dragCards.map((card) => <DragCard {...card} key={card.id} />)}
        {dropTarget.map((target) => <Droppable {...target} key={"drop".concat(target.id)} />)}
      </DndContext>
    </div>
  );
}
