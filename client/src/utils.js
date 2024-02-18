import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  SEGMENT_SIZE,
  SNAKE_DELAY,
} from "./options";
import { snakeControl, snakeEatFood, snakeEatItself } from "./snakeControl";

export function useInterval(callback, delay) {
  const savedCallback = useRef(callback);
  //   console.log(delay);
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export const useLogic = ({ onGameOver, gameStatus }) => {
  const [snakeBody, setSnakeBody] = useState([
    {
      x: 0,
      y: 0,
    },
  ]);

  const snakeSpeed = useRef(SNAKE_DELAY);

  const resetGame = () => {
    setDirection(undefined);
    snakeSpeed.current = SNAKE_DELAY;
    setFoodPosition({
      x: randomPositionOnCanvas({
        GRID_SIZE: SEGMENT_SIZE,
        threshold: CANVAS_WIDTH,
      }),
      y: randomPositionOnCanvas({
        GRID_SIZE: SEGMENT_SIZE,
        threshold: CANVAS_HEIGHT,
      }),
    });

    setSnakeBody([
      {
        x: randomPositionOnCanvas({
          GRID_SIZE: SEGMENT_SIZE,
          threshold: CANVAS_WIDTH,
        }),
        y: randomPositionOnCanvas({
          GRID_SIZE: SEGMENT_SIZE,
          threshold: CANVAS_HEIGHT,
        }),
      },
    ]);
  };

  const [foodPosition, setFoodPosition] = useState();

  // start snake and food positions
  useEffect(() => {
    if (!CANVAS_HEIGHT || !CANVAS_WIDTH) {
      return;
    }
    setFoodPosition({
      x: randomPositionOnCanvas({
        GRID_SIZE: SEGMENT_SIZE,
        threshold: CANVAS_WIDTH,
      }),
      y: randomPositionOnCanvas({
        GRID_SIZE: SEGMENT_SIZE,
        threshold: CANVAS_HEIGHT,
      }),
    });
    setSnakeBody([
      {
        x: randomPositionOnCanvas({
          GRID_SIZE: SEGMENT_SIZE,
          threshold: CANVAS_WIDTH,
        }),
        y: randomPositionOnCanvas({
          GRID_SIZE: SEGMENT_SIZE,
          threshold: CANVAS_HEIGHT,
        }),
      },
    ]);
  }, []);

  const [direction, setDirection] = useState();
  const snakeHeadPosition = snakeBody[snakeBody.length - 1];
  const { toUp, toDown, toLeft, toRight } = snakeControl();

  // snake move control buttons
  const onKeyDownHandler = (e) => {
    switch (e.code) {
      case "KeyS":
        if (direction !== "UP") {
          setDirection("DOWN");
        }
        break;
      case "KeyW":
        if (direction !== "DOWN") {
          setDirection("UP");
        }
        break;
      case "KeyA":
        if (direction !== "RIGHT") {
          setDirection("LEFT");
        }
        break;
      case "KeyD":
        if (direction !== "LEFT") {
          setDirection("RIGHT");
        }
        break;
    }
    //  console.log(e.code);
    //  console.log(direction)
  };

  const moveSnake = () => {
    let newSnakePosition;
    switch (direction) {
      case "DOWN":
        if (
          CANVAS_HEIGHT &&
          snakeHeadPosition.y < CANVAS_HEIGHT - SEGMENT_SIZE
        ) {
          newSnakePosition = toDown(snakeBody);
        } else if (CANVAS_WIDTH && snakeHeadPosition.x > CANVAS_WIDTH / 2) {
          setDirection("LEFT");
        } else {
          setDirection("RIGHT");
        }
        break;
      case "UP":
        if (snakeHeadPosition.y > 0) {
          newSnakePosition = toUp(snakeBody);
        } else if (CANVAS_WIDTH && snakeHeadPosition.x > CANVAS_WIDTH / 2) {
          setDirection("LEFT");
        } else {
          setDirection("RIGHT");
        }
        break;
      case "LEFT":
        if (snakeHeadPosition.x > 0) {
          newSnakePosition = toLeft(snakeBody);
        } else if (CANVAS_HEIGHT && snakeHeadPosition.y < CANVAS_HEIGHT / 2) {
          setDirection("DOWN");
        } else {
          setDirection("UP");
        }
        break;
      case "RIGHT":
        if (CANVAS_WIDTH && snakeHeadPosition.x < CANVAS_WIDTH - SEGMENT_SIZE) {
          newSnakePosition = toRight(snakeBody);
        } else if (CANVAS_HEIGHT && snakeHeadPosition.y < CANVAS_HEIGHT / 2) {
          setDirection("DOWN");
        } else {
          setDirection("UP");
        }
        break;
    }

    // Game over
    if (newSnakePosition) {
      const gameOver = snakeEatItself(newSnakePosition);
      if (gameOver) {
        onGameOver();
      }
    }

    // Snake eating food
    if (
      direction !== undefined &&
      foodPosition &&
      snakeEatFood(foodPosition, snakeHeadPosition, direction)
    ) {
      setSnakeBody([
        ...newSnakePosition,
        { x: foodPosition.x, y: foodPosition.y },
      ]);

      setFoodPosition({
        x: randomPositionOnCanvas({ threshold: CANVAS_WIDTH }),
        y: randomPositionOnCanvas({ threshold: CANVAS_HEIGHT }),
      });
    } else if (newSnakePosition) {
      setSnakeBody(newSnakePosition);
    }
  };

  // game score
  let score = (snakeBody.length - 1) * 10;

  // snake's step delay
  useEffect(() => {
    if (snakeSpeed.current <= 10) {
      return;
    } else if (score > 0 && score % 50 === 0) {
      snakeSpeed.current = snakeSpeed.current - 10;
    }
  }, [score]);

  // info about speed for total score table
  let speed = Math.round(100 - (snakeSpeed.current / SNAKE_DELAY) * 100);

  useInterval(moveSnake, gameStatus === "RUN" ? snakeSpeed.current : null);

  return {
    snakeBody,
    onKeyDownHandler,
    foodPosition,
    resetGame,
    score,
    speed,
  };
};

export const draw = ({ ctx, snakeBody, foodPosition }) => {
  ctx.fillStyle = "red";
  snakeBody.forEach((segment) =>
    ctx.fillRect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE)
  );

  if (foodPosition) {
    ctx.fillStyle = "green";
    ctx.fillRect(foodPosition.x, foodPosition.y, SEGMENT_SIZE, SEGMENT_SIZE);
  }
};

const randomPositionOnCanvas = ({ GRID_SIZE = 5, threshold }) => {
  return Math.floor(Math.random() * (threshold / GRID_SIZE)) * GRID_SIZE;
};
