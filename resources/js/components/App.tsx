import React, { Suspense, lazy } from 'react'
import One from './One'

const Two = lazy(() => import('./Two'))

interface Props {
  heading: string;
}

const App = ({ heading }: Props) => (
  <div>
    <h1>{heading}</h1>
    <One />
    <Suspense fallback={<div>Loading...</div>}>
      <Two />
    </Suspense>
  </div>
)

export default App
