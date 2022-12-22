// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'
import { useEffect, useState } from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    const { error } = this.state
    const { children, FallbackComponent } = this.props

    if (error) return <FallbackComponent error={error} />

    return children
  }
}

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = useState({ status: 'idle', pokemon: null, error: null })
  const { status, pokemon, error } = state;

  useEffect(() => {
    const makePokemonApiCall = async (name) => {
      try {
        setState({ status: 'pending' })
        const pokemonData = await fetchPokemon(name)
        setState({ status: 'resolved', pokemon: pokemonData })
      } catch (e) {
        setState({ status: 'rejected', error: e })
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
    throw error
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
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
