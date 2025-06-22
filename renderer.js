const e = React.createElement;
const { useState, useEffect } = React;

function DeckButton({ item, onClick }) {
  return e(
    'button',
    {
      className: 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 p-4 rounded-lg m-1 flex flex-col items-center',
      onClick,
    },
    item.icon ? e('img', { src: item.icon, className: 'h-6 w-6 mb-1' }) : null,
    e('span', null, item.label)
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
    stack.length > 0 && e('button', { className: 'mb-2', onClick: goBack }, 'Back'),
    e(
      'div',
      { className: 'grid grid-cols-3 gap-2' },
      page.map((item, idx) =>
        e(DeckButton, { key: idx, item, onClick: () => openItem(item) })
      )
    )
  );
}

ReactDOM.render(e(App), document.getElementById('root'));
