export default function demo(getIsDemoRunning, cb) {
  const moves = ['bottom', 'top', 'left', 'right'];
  const buttons = ['button_0', 'button_1', 'button_2'];

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Do a step, after a random timer
  const doStep = (step) => {
    return new Promise((resolve) => {
      //this demo has been canceled, just noop
      if (getIsDemoRunning() === false) return resolve()

      setTimeout(() => {
        //same but we executed this later
        if (getIsDemoRunning() === false) return resolve()

        const [joypadEvent, detail] = step
        window.joypad.emit(joypadEvent, {detail: {[joypadEvent === 'axis_move' ? 'directionOfMovement' : 'buttonName']: detail, demo: true}})
        resolve()
      }, getRandomInt(700, 900))
    })
  }

  // Do all the steps in series
  const doSteps = function(steps) {
    return steps.reduce((p, step) => {
      return p.then(() => doStep(step));
    }, Promise.resolve())
  }

  // Generate 1 to 9 random moves
  const generateMoves = ()  => (new Array(getRandomInt(1, 10))).fill(0).map(() => getRandomInt(0, 3) === 0 ? ['button_press', 'button_8'] : ['axis_move', moves[getRandomInt(0, 4)]])
  // Generate 1 to 5 random vertical moves
  const generateVerticalMoves = ()  => (new Array(getRandomInt(1, 10))).fill(0).map(() => ['axis_move', moves[getRandomInt(0, 2)]])

  const stepsNb = 10

  // show qrcode
  doSteps(Array.from({length: stepsNb}).reduce((steps, _, i) => [
      // clone earlier steps
    ...steps,
    // generate random releases moves, it can also select one
    ...generateMoves(),
    // select a release (or maybe unselect?)
    ['button_press', 'button_8'],
    // change to another random page (artist or year)
    ['button_press', buttons[getRandomInt(0, 3)]],
    // navigate vertically
    ...generateVerticalMoves(),
    // select the year or artist
    ['button_press', 'button_8'],
    // at the end show qrcode
    ...(i === stepsNb - 1 ? [['button_press', 'button_9']] : [])
  ], []))
  .then(cb)
}
