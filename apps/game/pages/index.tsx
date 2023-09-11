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
  const allItems = quizletSet.studiableItem.slice(0, 8);

  // const [quizletSet, setQuizletSet] = useState(undefined);
  // useEffect(() => setQuizletSet(Quizlet.getRandomSet()), []);

  if (!quizletSet) return null;

  const cardCount = 5;
  const targetCount = 3;

  // Get random count elements in set a that's not in set b
  function getRandom(a, b, count:number) {
    const items = a.filter(x => !b.includes(x));
    let ret = [];
    while (items.length > 0 && count > 0) {
      const rng = Math.floor(Math.random() * items.length);
      const item = items[rng];
      items.splice(rng, 1);
      ret.push(item);
      count--;
    }
    return ret;
  }

  const [dragCards, setDragCards] = useState([]);
  const [dropTarget, setDropTarget] = useState([]);

  // items that are in dragCards but not in dropTarget
  const [selected, setSelected] = useState(null);

  function update() {
    const initialCards = getRandom(allItems, [], cardCount); 
    setDragCards(initialCards);
    setDropTarget(getRandom(initialCards, [], targetCount));
  }
  // console.log(dragCards);
  // console.log(dropTarget);
  useEffect(update, []);

  return (
    <div>
      <h1>Your game title here!</h1>
      <h2>Set used: {quizletSet.set.title}</h2>
      <button onClick={update}>Update!</button>
      <DndContext
        onDragStart={(event) => {
          setSelected(event.active.id)
        }}
        onDragEnd={(event) => {
          console.log(selected, "::: ", event.over?.id)
        }}
        collisionDetection={rectIntersection}>
        <div className='dropzone-container'>
        {dropTarget.map((item) => <Droppable card={item.cardSides[1]} id={item.id} key={"drop".concat(item.id.toString())} />)}
        </div>
        {dragCards.map((item) => <DragCard card={item.cardSides[0]} id={item.id} key={item.id} />)}
      </DndContext>
    </div>
  );
}
