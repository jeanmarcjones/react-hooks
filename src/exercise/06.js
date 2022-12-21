// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'
import { useEffect, useState } from 'react';

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = useState(null)

  useEffect(() => {
    const makePokemonApiCall = async (name) => {
      setPokemon(null);
      const pokemonData = await fetchPokemon(name)
      setPokemon(pokemonData)
    }

    if (pokemonName) {
      makePokemonApiCall(pokemonName)
    }
  }, [pokemonName])

  return (
    <>
      {!pokemonName && (
        <div>Submit a pokemon</div>
      )}
      {pokemonName && !pokemon && (
        <PokemonInfoFallback name={pokemonName}/>
      )}
      {pokemon && (
        <PokemonDataView pokemon={pokemon}/>
      )}
    </>
  )
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
