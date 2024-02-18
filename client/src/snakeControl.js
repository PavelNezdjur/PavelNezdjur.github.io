export const snakeControl = (GRID_SIZE = 5) => ({
  toRight: (snakeBody) => {
    const bodyCopy = [...snakeBody];
    const headPosition = bodyCopy[bodyCopy.length - 1];
    bodyCopy.shift();
    return [...bodyCopy, { ...headPosition, x: headPosition.x + GRID_SIZE }];
  },
  toLeft: (snakeBody) => {
    const bodyCopy = [...snakeBody];
    const headPosition = bodyCopy[bodyCopy.length - 1];
    bodyCopy.shift();
    return [...bodyCopy, { ...headPosition, x: headPosition.x - GRID_SIZE }];
  },
  toUp: (snakeBody) => {
    const bodyCopy = [...snakeBody];
    const headPosition = bodyCopy[bodyCopy.length - 1];
    bodyCopy.shift();
    return [...bodyCopy, { ...headPosition, y: headPosition.y - GRID_SIZE }];
  },
  toDown: (snakeBody) => {
    const bodyCopy = [...snakeBody];
    const headPosition = bodyCopy[bodyCopy.length - 1];
    bodyCopy.shift();
    return [...bodyCopy, { ...headPosition, y: headPosition.y + GRID_SIZE }];
  },
});

export const snakeEatFood = (foodPosition, snakeHeadPosition, direction) => {
  switch (direction) {
    case "UP":
      return (
        foodPosition.x === snakeHeadPosition.x &&
        snakeHeadPosition.y - 5 === foodPosition.y
      );
    case "DOWN":
      return (
        foodPosition.x === snakeHeadPosition.x &&
        snakeHeadPosition.y + 5 === foodPosition.y
      );
    case "LEFT":
      return (
        foodPosition.y === snakeHeadPosition.y &&
        snakeHeadPosition.x - 5 === foodPosition.x
      );
    case "RIGHT":
      return (
        foodPosition.y === snakeHeadPosition.y &&
        snakeHeadPosition.x + 5 === foodPosition.x
      );
  }
};

export const snakeEatItself = (snakeBody) => {
  if (snakeBody.length <= 1) {
    return false;
  }

  const head = snakeBody[snakeBody.length - 1];
  const body = snakeBody.slice(0, snakeBody.length - 1);

  return body.some((segment) => segment.x === head.x && segment.y === head.y);
};
