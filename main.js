const socket = new WebSocket('ws://localhost:3000');
const editor = ace.edit('editor');

editor.session.setMode('ace/mode/javascript');
editor.setTheme('ace/theme/monokai');

editor.setOptions({
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
});

const langTools = ace.require('ace/ext/language_tools');
const completions = [
  { value: 'console.log()', caption: 'console.log()', meta: 'function' },
  { value: 'if', caption: 'if', meta: 'keyword' },
  // Add more autocompletion items
];

langTools.addCompleter({
  getCompletions: (editor, session, pos, prefix, callback) => {
    callback(null, completions);
  },
});

const cursorMap = {};

socket.addEventListener('open', () => {
  console.log('WebSocket connection established');
});

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'content') {
    editor.setValue(data.content);
  } else if (data.type === 'contentChange') {
    editor.setValue(data.content, 1);
  } else if (data.type === 'cursorChange') {
    const { clientId, cursor } = data;
    const cursorId = `cursor-${clientId}`;

    if (cursorMap[clientId]) {
      cursorMap[clientId].setPosition(cursor.row, cursor.column);
    } else {
      const cursorElement = document.createElement('div');
      cursorElement.id = cursorId;
      cursorElement.className = 'cursor';
      document.querySelector('.cursor-indicators').appendChild(cursorElement);

      cursorMap[clientId] = editor.getSession().addDynamicMarker({
        type: 'text',
        range: new ace.Range(cursor.row, cursor.column, cursor.row, cursor.column + 1),
        renderer: cursorElement,
        id: cursorId,
      });
    }
  }
});

editor.getSession().on('change', () => {
  const content = editor.getValue();
  socket.send(JSON.stringify({ type: 'contentChange', content }));
});

editor.on('changeCursor', () => {
  const cursorPosition = editor.getCursorPosition();
  socket.send(JSON.stringify({ type: 'cursorChange', cursor: cursorPosition }));
});
