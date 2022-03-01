// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  const { status, pokemon, error } = state
  
  React.useEffect(() => {
    async function fetchData() {
      setState({ status: 'pending'})
      try {
        const pokemon = await fetchPokemon(pokemonName);
        setState({status: 'resolved', pokemon })
      } catch (error) {
        setState({status: 'rejected', error })
      }
    }
    if(!!pokemonName) fetchData()

  }, [ pokemonName ])

  if(status === 'idle') return 'Submit a pokemon'
  if(status === 'pending') return <PokemonInfoFallback name={pokemonName} />
  if(status === 'rejected') throw error
  return <PokemonDataView pokemon={pokemon} />
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
