import { useState, useEffect, useCallback } from 'react';
import StoryMode from './components/StoryMode';
import Portfolio from './components/Portfolio';
import './styles.css';

const TWEAK_DEFAULTS = {
  pacing: 4,
  bitmojiSize: 'medium',
  bubbleShape: 'rounded',
  skipPos: 'tr',
  typography: 'serif-heavy',
  autoStart: true
};

function useTweaks(defaults) {
  const [values, setValues] = useState(defaults);
  const setTweak = useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
  }, []);
  return [values, setTweak];
}

function App() {
  const [mode, setMode] = useState('story');
  const [tweaks] = useTweaks(TWEAK_DEFAULTS);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.classList.remove('serif-heavy', 'sans-heavy');
    document.body.classList.add(tweaks.typography || 'serif-heavy');
  }, [tweaks.typography]);

  return (
    <>
      <button
        className="theme-toggle"
        onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {mode === 'story' ? (
        <StoryMode tweaks={tweaks} onFinish={() => setMode('portfolio')} />
      ) : (
        <Portfolio tweaks={tweaks} onReplay={() => setMode('story')} />
      )}
    </>
  );
}

export default App;
