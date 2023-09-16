import Quizlet from 'dataset';
import Fun from 'dataset/sets/Fun';
import Science from 'dataset/sets/Science';
import Language from 'dataset/sets/Language';

import { closestCenter, DndContext, DragEndEvent, DragOverlay, rectIntersection } from '@dnd-kit/core';

import { DragCard } from '../Draggable';
import { Droppable } from '../Droppable';
import { useEffect, useRef, useState } from 'react';
import { StudiableItem } from 'dataset/types';
import { restrictToParentElement, snapCenterToCursor } from '@dnd-kit/modifiers';

interface DragCard extends StudiableItem {
  pos: {
    x: number,
    y: number
  }
}

function HUDText({text, label}) {
  return (
  <div className='HUD-text'>
    <div className='HUD-text-main'>
      {text}
    </div>
    <div className='HUD-text-label'>
      {label}
    </div>
  </div>
  )
}

export default function Game() {
  // to get a specific Set

  // const quizletSet = Fun.getAllSetsMap().jokes;
  const quizletSet = Language.getAllSetsMap().chineseFood;
  const allItems = quizletSet.studiableItem.slice(0, 8);

  // const [quizletSet, setQuizletSet] = useState(undefined);
  // useEffect(() => setQuizletSet(Quizlet.getRandomSet()), []);

  const cardCount = 5;
  const targetCount = 3;

  const [dragCards, setDragCards] = useState<DragCard[]>([]);
  const [dropTarget, setDropTarget] = useState([]);
  const [score, setScore] = useState(0);

  // items that are in dragCards but not in dropTarget
  const [selected, setSelected] = useState(null);

  // Get random count elements in set a that's not in set b
  function getRandom(a: StudiableItem[], b: StudiableItem[], count: number = 1) {
    const items = a.filter(x => !b.some(y => y.id == x.id));
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

  const spawnAreaRef = useRef(null);

  function createCard(item: StudiableItem) {
    console.log(getComputedStyle(spawnAreaRef.current));
    return { ...item, pos: { x: 0, y: 0 }};
  }

  function update() {
    const initialCards = getRandom(allItems, [], cardCount);
    setDragCards(initialCards.map(item => {
      // return { ...item, pos: { x: Math.floor(Math.random() * 300), y: Math.floor(Math.random() * 300) }}
      return createCard(item);
    }));
    setDropTarget(getRandom(initialCards, [], targetCount));
  }
  // I think randomness requires use effect, otherwise there will be hydration error.
  useEffect(update, []);

  function handleDragEnd(event: DragEndEvent) {
    console.log(selected, "::: ", event.over?.id)
    const { x: dx, y: dy } = event.delta;
    if (event.over) {
      if (event.over.id == selected.id) {
        setScore(score + 1);
      } else {
        setScore(score - 1);
      }
      // Dangerous
      const newCard = createCard(getRandom(allItems, dragCards, 1)[0]);
      const newTarget = getRandom(dragCards, dropTarget, 1)[0];
      setDragCards(
        dragCards.map(item => item.id == event.active.id ? newCard : item)
      );
      setDropTarget(
        dropTarget.map(item => item.id == event.over.id ? newTarget : item)
      );
    } else {
      setDragCards(
        dragCards.map(item => item.id == event.active.id ?
          {
            ...item,
            pos: {
              x: item.pos.x + dx,
              y: item.pos.y + dy
            },
          }
          : item
        )
      );
    }
  }

  return (
    <div className='game-area'>
      <DndContext
        onDragStart={(event) => {
          const item = dragCards.find(x => x.id == event.active.id)
          setSelected(item)
        }}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
        collisionDetection={rectIntersection}>
        <div className='top-area' >
          <div className='HUD'>
            <HUDText text={score} label="score" />
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
          </div>
          {/* <button onClick={update}>Update!</button> */}
          <div className='dropzone-container'>
            {dropTarget.map((item) => <Droppable card={item.cardSides[1]} id={item.id} key={"drop".concat(item.id.toString())} />)}
          </div>
        </div>
        <div className='drag-card-area' ref={spawnAreaRef}>
        </div>
        {dragCards.map((item) => <DragCard card={item.cardSides[0]} pos={item.pos} id={item.id} key={item.id} />)}
      </DndContext>
    </div>
  );
}
