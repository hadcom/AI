const e = React.createElement;
const { useState, useEffect } = React;

function DeckButton({ item, onClick }) {
  return e(
    'button',
    {
      className:
        'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-xl m-2 p-2 w-28 h-28 flex flex-col items-center justify-center shadow-md',
      onClick,
    },
    item.icon
      ? e('img', {
          src: item.icon,
          className: 'w-16 h-16 object-contain mb-1 rounded',
        })
      : null,
    e('span', { className: 'text-xs text-center' }, item.label)
  );
}

function App() {
  const [stack, setStack] = useState([]);
  const [page, setPage] = useState([]);

  useEffect(() => {
    window.api.loadConfig().then(cfg => {
      setPage(cfg.buttons || []);
    });
  }, []);

  useEffect(() => {
    window.api.onHotkey(() => {
      const onUp = () => {
        window.api.hideWindow();
        window.removeEventListener('keyup', onUp);
      };
      window.addEventListener('keyup', onUp);
    });
  }, []);

  const openItem = item => {
    if (item.children) {
      setStack([...stack, page]);
      setPage(item.children);
    } else if (item.action) {
      window.api.launch(item.action);
    }
  };

  const goBack = () => {
    if (stack.length === 0) return;
    const prev = stack.pop();
    setPage(prev);
    setStack([...stack]);
  };

  return e(
    'div',
    null,
    stack.length > 0 &&
      e(
        'button',
        { className: 'mb-2 text-sm underline', onClick: goBack },
        'Back'
      ),
    e(
      'div',
      { className: 'grid grid-cols-3 gap-3' },
      page.map((item, idx) =>
        e(DeckButton, { key: idx, item, onClick: () => openItem(item) })
      )
    )
  );
}

ReactDOM.render(e(App), document.getElementById('root'));
