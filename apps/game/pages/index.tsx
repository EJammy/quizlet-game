import Quizlet from 'dataset';
import Fun from 'dataset/sets/Fun';
import Science from 'dataset/sets/Science';
import Language from 'dataset/sets/Language';

import { closestCenter, DndContext, DragEndEvent, DragOverlay, rectIntersection } from '@dnd-kit/core';

import { DragCard, DragCardProps } from '../Draggable';
import { DropCard } from '../Droppable';
import { startTransition, useEffect, useRef, useState } from 'react';
import { StudiableItem } from 'dataset/types';
import { restrictToParentElement, snapCenterToCursor } from '@dnd-kit/modifiers';
import { start } from 'repl';

interface DragCard extends StudiableItem {
  pos: {
    x: number,
    y: number
  }
}

function HUDText({text, label}) {
  return (
  <div className='HUD-textbox'>
    <div className='HUD-text-main'>
      {text}
    </div>
    <div className='HUD-text-label'>
      {label}
    </div>
  </div>
  )
}

function ComboBox({status}) {
  const className = 'combo-box ' + (status ? 'combo-box-on' : 'combo-box-off');
  return (
  <div className={className} />
  )
}

export default function Game() {

  // const quizletSet = Fun.getAllSetsMap().jokes;
  // const quizletSet = Language.getAllSetsMap().chineseFood;

  const [quizletSet, setQuizletSet] = useState(undefined);
  useEffect(() => setQuizletSet(Quizlet.getRandomSet()), []);

  const allItems = quizletSet? quizletSet.studiableItem: null;

  const cardCount = allItems? Math.min(allItems.length - 1, 6) : 0;
  const targetCount = 3;

  const [dragCards, setDragCards] = useState<DragCardProps[]>([]);
  const [dropCards, setDropCards] = useState([]);
  const [score, setScore] = useState(0);

  const [selected, setSelected] = useState(null);
  const [cardsZIndex, setCardsZIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);


  const spawnAreaRef = useRef(null);
  function randomRange(min: number, n: number) {
    return Math.floor(Math.random() * n) + min;
  }

  function createCard(item: StudiableItem): DragCardProps {
    const rect = spawnAreaRef.current.getBoundingClientRect();
    // TODO: Change me
    const cardWidth = 350;
    const cardHeight = 300;

    const pos = { x: randomRange(rect.x, rect.width - cardWidth), y: randomRange(rect.y, rect.height - cardHeight) }
    return { card: item.cardSides[0], id: item.id, pos: pos, zIndex: cardsZIndex};
  }

  // Get random elements in set a that's not in set b
  function getRandom(a: { id: number }[], b: { id: number }[], count: number = 1) {
    const items = allItems.filter(x => a.some(y => y.id == x.id) && !b.some(y => y.id == x.id));
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

  // I think randomness requires use effect, otherwise there will be hydration error.
  // useEffect(update, []);

  // Timer stuff
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  let timeRemaining = 0;
  if (startTime != null && now != null) {
    timeRemaining = 45 - Math.round((now - startTime) / 1000);
  }

  function startGame() {
    setScore(0);
    setMultiplier(1);
    setCombo(0);
    const initialCards = getRandom(allItems, [], cardCount);
    setDragCards(initialCards.map(item => {
      return createCard(item);
    }));
    setDropCards(getRandom(initialCards, [], targetCount));

    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);
  }

  function endGame() {
    clearInterval(intervalRef.current);
    setDragCards([]);
    setDropCards([]);
  }

  // Can avoid useEffect here
  useEffect(() => {
    if (timeRemaining <= 0 && startTime != null) {
      endGame();
    }
  }, [timeRemaining, startTime]);

  function handleDragEnd(event: DragEndEvent) {
    const rect = spawnAreaRef.current.getBoundingClientRect();
    const { x: dx, y: dy } = event.delta;
    if (event.over) {
      if (event.over.id == selected.id) {
        setScore(score + 10 * multiplier);
        const newCombo = combo + 1;
        if (newCombo > 3) {
          setMultiplier(multiplier + 1);
          setCombo(0);
        } else {
          setCombo(newCombo);
        }
      } else {
        setCombo(0);
        setMultiplier(1);
      }
      // Dangerous
      const newCard = createCard(getRandom(allItems, dragCards, 1)[0]);
      const newTarget = getRandom(dragCards, dropCards, 1)[0];
      setDragCards(
        dragCards.map(item => item.id == event.active.id ? newCard : item)
      );
      setDropCards(
        dropCards.map(item => item.id == event.over.id ? newTarget : item)
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
            zIndex: cardsZIndex + 1
          }
          : item
        )
      );
      setCardsZIndex(cardsZIndex + 1);
    }
  }

  const startOverlay = timeRemaining >= 0.001 ? null :
    (
      <div className='start-overlay' key="start-overlay" >
        <h1> Combo Matcher </h1>
        {score > 0 ?
          <h2>
          Score: {score}
          </h2> :
          <p>
            - Match cards<br />
            - Gain combo for each correct match<br />
            - +1 to multipler for every 4 combo<br />
            - Loses all combo and multiplier on mistake, watch out!<br />
          </p>
        }
        <button onClick={startGame} className='start-button'>Start</button>
      </div>
    )

  return (
    <>
      { startOverlay }
      <div className='outer-area'>
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
                <div className='combo-area'>
                  {[0, 1, 2].map(x => <ComboBox status={combo > x} key={x} />)}
                </div>
                <HUDText text={score} label="score" />
                <HUDText text={"X" + multiplier} label="multiplier" />
                <HUDText text={timeRemaining} label="Timer" />
              </div>
              {/* <button onClick={update}>Update!</button> */}
              <div className='drop-card-area'>
                {dropCards.map((item) => <DropCard card={item.cardSides[1]} id={item.id} key={"drop".concat(item.id.toString())} />)}
              </div>
            </div>
            <div className='drag-card-area' ref={spawnAreaRef}>
            </div>
            {dragCards.map(item => <DragCard {...item} key={item.id} />)}
          </DndContext>
        </div>
      </div>
    </>
  );
}
