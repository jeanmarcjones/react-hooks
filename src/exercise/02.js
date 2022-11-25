// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import { useEffect, useRef } from 'react';

const useLocalStorageState = (key, initialValue = '', {
  serialize = JSON.stringify,
  deserialize = JSON.parse
} = {}) => {
  const [value, setValue] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  })

  const prevKey = useRef(key);

  useEffect(() => {
    if (prevKey.current !== key) {
      window.localStorage.removeItem(prevKey.current)
    }
    prevKey.current = key
    window.localStorage.setItem(key, serialize(value))
  }, [key, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName);

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Scottie" />
}

export default App
