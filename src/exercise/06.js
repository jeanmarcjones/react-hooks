// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'
import { useEffect, useState } from 'react';

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = useState(null)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const makePokemonApiCall = async (name) => {
      try {
        setStatus('pending')
        const pokemonData = await fetchPokemon(name)
        setPokemon(pokemonData)
        setStatus('resolved')
      } catch (e) {
        setError(e)
        setStatus('rejected')
      }
    }

    if (pokemonName) {
      makePokemonApiCall(pokemonName)
    }
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName}/>
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon}/>
  } else if (status === 'rejected') {
    return (
      <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  } else {
    return null;
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
