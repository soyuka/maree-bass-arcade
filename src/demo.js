export default function demo() {
  const moves = ['left', 'right', 'bottom', 'top'];
  const buttons = ['button_0', 'button_1', 'button_2'];

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const doStep = (step) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const [joypadEvent, detail] = step
        window.joypad.emit(joypadEvent, {detail: {[joypadEvent === 'axis_move' ? 'directionOfMovement' : 'buttonName']: detail}})
        resolve()
      }, getRandomInt(700, 1500))
    })
  }

  const doSteps = function(steps) {
    return steps.reduce((p, step) => {
      return p.then(() => doStep(step));
    }, Promise.resolve())
  }

  const generateMoves = ()  => (new Array(getRandomInt(1, 10))).fill(0).map(() => ['axis_move', moves[getRandomInt(0, 3)]])

  let steps = []

  for (let i = 0; i < 20; i++) {
    steps = [...steps, ...generateMoves(), ['button_press', 'button_8'], ['button_press', buttons[getRandomInt(0, 2)]]]
  }

  steps.push(['button_press', 'button_9'])
  doSteps(steps)
}
