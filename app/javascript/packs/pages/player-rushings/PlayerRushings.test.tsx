import React from 'react'
import PlayerRushings from '.'
import { render, within, act } from '@testing-library/react'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Player rushings page', () => {
  beforeEach(() => {
    const anyGlobal: any = global
    anyGlobal.fetch = jest.fn(() => {
      return Promise.resolve({ status: 200, json: () => Promise.resolve([]) })
    })
  })

  it('fetches players rushings from the api', async () => {
    render(<PlayerRushings />)

    await act(() =>
      new Promise((resolve, _) => setTimeout(resolve, 0))
    )

    expect(global.fetch).toHaveBeenCalledWith('/player_rushings')
  })

  describe('when the player rushings query is successfull', () => {
    const playerRushings = [{ player_name: 'name' }]
    
    beforeEach(() => {
      const anyGlobal: any = global
      anyGlobal.fetch = jest.fn(() => {
        return Promise.resolve({ status: 200, json: () => Promise.resolve(playerRushings) })
      })
    })

    it('shows table of player rushings', async () => {
      const component = render(<PlayerRushings />)

      await act(() =>
        new Promise((resolve, _) => setTimeout(resolve, 0))
      )

      const table = component.getByRole('table')
      const rows = within(table).getAllByRole('row')

      expect(rows.length).toEqual(playerRushings.length + 1)
    })
  })
})