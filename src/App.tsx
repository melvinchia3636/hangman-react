/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import words from './words.json';

function App() {
  const [target, setTarget] = useState(
    words[Math.floor(Math.random() * words.length)].toUpperCase(),
  );
  const [guessed, setGuessed] = useState<string[]>([]);
  const [chanceLeft, setChanceLeft] = useState(7);
  const [lost, setLost] = useState(false);
  const [win, setWin] = useState(false);
  const [hints, setHints] = useState(false);
  const [meaning, setMeaning] = useState('');
  const [dark, setDark] = useState(true);
  const [guess, setGuess] = useState(() => (letter: string) => {});
  const [open, setOpen] = useState(false);

  const reset = () => {
    setOpen(false);
    setTimeout(() => {
      setTarget(words[Math.floor(Math.random() * words.length)].toUpperCase());
      setGuessed([]);
      setChanceLeft(7);
      setLost(false);
      setWin(false);
    }, 200);
  };

  useEffect(() => {
    setGuess(() => (letter: string) => {
      if (!win && !lost) {
        if (!guessed.includes(letter)) {
          if (!target.includes(letter)) {
            setChanceLeft(chanceLeft - 1);
          }
          setGuessed([...guessed, letter]);
        }
      }
    });
  }, [guessed, target, win, lost, chanceLeft]);

  useEffect(() => {
    const fetchMeaning = async () => {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${target}`);
      const data = await response.json();
      setMeaning(data[0].meanings[0].definitions[0].definition);
    };
    fetchMeaning();
  }, [target]);

  useEffect(() => {
    setLost(chanceLeft === 0);
  }, [chanceLeft]);

  useEffect(() => {
    setWin(target.split('').every((e) => guessed.includes(e)));
  }, [guessed]);

  useEffect(() => {
    if (win || lost) {
      setOpen(true);
    }
  }, [win, lost]);

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.key.match(/^[a-zA-Z]$/i)) {
        guess(e.key.toUpperCase());
      }
      if (win || lost) {
        if (e.key === 'Enter') {
          reset();
        }
      }
    };
  }, [guessed, guess, win, lost]);

  return (
    <div className={dark ? 'dark' : ''}>
      <main className="bg-stone-100 transition-all dark:bg-stone-600 font-['Rubik'] font-medium flex flex-col text-stone-600 dark:text-stone-100 items-center w-full h-screen">
        <nav className="flex w-full px-8 py-6 items-center justify-between">
          <h1 className="text-xl uppercase tracking-widest">Hangman</h1>
          <ul className="flex items-center gap-8">
            <li>
              <button
                tabIndex={-1}
                type="button"
                onClick={() => {
                  setHints(true);
                  setOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Icon
                  icon="octicon:light-bulb-16"
                  className="stroke-[0.5px] stroke-stone-600 dark:stroke-stone-100 w-5 h-5"
                />
                Hints
              </button>
            </li>
            <li>
              <button type="button" onClick={reset} className="flex items-center gap-2">
                <Icon
                  icon="octicon:sync-16"
                  className="stroke-[0.5px] stroke-stone-600 dark:stroke-stone-100 w-5 h-5"
                />
                Restart
              </button>
            </li>
            <li className="flex items-center">
              <label className="switch">
                <input
                  checked={!dark}
                  onClick={() => {
                    setDark(!dark);
                  }}
                  type="checkbox"
                />
                <span className="slider" />
              </label>
            </li>
            <li>
              <a
                href="https://github.com/melvinchia3636/hangman-react"
                className="flex items-center gap-2"
              >
                <Icon icon="octicon:mark-github-16" className="w-6 h-6" />
              </a>
            </li>
          </ul>
        </nav>
        <section className="w-full flex-1 flex flex-col items-center justify-center gap-8">
          <div className="flex gap-2 mb-8">
            {target.split('').map((letter) => (
              <div className="border-b-2 border-stone-300 p-2 text-3xl w-8 flex items-center justify-center h-12">
                {guessed.includes(letter) ? letter : ''}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 w-1/2 justify-center">
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
              <button
                type="button"
                onClick={() => guess(letter)}
                className={`${
                  guessed.includes(letter)
                    ? `${
                        target.includes(letter)
                          ? 'bg-stone-700 border-stone-800 dark:bg-stone-800 dark:border-stone-900'
                          : 'bg-stone-400 border-[#918b86] dark:bg-[#4f4b46] dark:border-stone-700'
                      } text-stone-100`
                    : ' border-stone-300 bg-stone-200 dark:border-stone-500 dark:bg-[#8f8883]'
                } rounded-md border-b-4 text-2xl w-12 flex items-center justify-center h-14`}
              >
                {letter}
              </button>
            ))}
          </div>
          <p className="text-xl">Chance left: {chanceLeft}</p>
          <div
            className={`flex w-full h-screen fixed top-0 left-0 items-center justify-center transition-all ${
              open ? 'bg-stone-900/30 z-[9999]' : 'bg-transparent z-[-1]'
            }`}
          >
            <div
              className={`transition-transform duration-300 ${
                open ? 'translate-x-0' : 'translate-x-[100vw]'
              }`}
            >
              {win || lost ? (
                <div className="bg-stone-100 text-stone-600 rounded-lg shadow-xl p-8 flex flex-col gap-4 items-center justify-center">
                  <p className="text-3xl">{win ? 'You Win =)' : 'You Lose ;-;'}</p>
                  <p className="text-xl font-normal">The word is: {target}</p>
                  <button
                    type="button"
                    onClick={reset}
                    className="bg-stone-700 mt-6 text-stone-100 rounded-md text-xl w-72 flex items-center justify-center h-16"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <div className="bg-stone-100 text-stone-600 rounded-lg shadow-xl p-8 flex flex-col gap-4 items-center justify-center max-w-[50vw] text-center">
                  <p className="text-3xl">Hints</p>
                  <p className="text-xl font-normal">{meaning}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setHints(false);
                      setOpen(false);
                    }}
                    id="play-again"
                    className="bg-stone-700 mt-6 text-stone-100 rounded-md text-xl w-72 flex items-center justify-center h-16"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <p className="text-sm text-center px-8 mb-4">
          Made with 🖤 by{' '}
          <a
            href="https://thecodeblog.net"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-2"
          >
            Melvin Chia
          </a>{' '}
          from{' '}
          <a
            href="https://mrga.thecodeblog.net"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-2"
          >
            MRGA
          </a>
          . Project under MIT license.
        </p>
      </main>
    </div>
  );
}

export default App;
