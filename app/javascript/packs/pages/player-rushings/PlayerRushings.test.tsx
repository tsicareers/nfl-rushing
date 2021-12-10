import React from 'react'
import PlayerRushings from '.'
import '@testing-library/jest-dom'
import { render, within, fireEvent } from '@testing-library/react'
import { waitForComponentAsyncUpdate } from '../../test-utils/async-helpers'

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

  it('displays a search input', async () => {
    const component = render(<PlayerRushings />)

    await waitForComponentAsyncUpdate()

    expect(component.getByRole('searchbox')).toBeInTheDocument()
  })

  it('fetches players rushings from the api', async () => {
    render(<PlayerRushings />)

    await waitForComponentAsyncUpdate()

    expect(global.fetch).toHaveBeenCalledWith('/player_rushings')
  })

  describe('when the user searches for a player name', () => {
    const searchResults = [{ player_name: 'Chad Murphy' }]
    beforeEach(() => {
      const anyGlobal: any = global
      anyGlobal.fetch = jest.fn((url: string) => {
        if(url.includes('search')) {
          return Promise.resolve({ status: 200, json: () => Promise.resolve(searchResults) })
        }
        return Promise.resolve({ status: 200, json: () => Promise.resolve([]) })
      })
    })

    it('fetches player rushings with search parameter', async () => {
      const component = render(<PlayerRushings />)

      await waitForComponentAsyncUpdate()

      const searchBox = component.getByRole('searchbox')
      fireEvent.change(searchBox, { target: { value: 'Chad Murphy' } })
      const searchButton = component.getByLabelText('search')
      fireEvent.click(searchButton)

      await waitForComponentAsyncUpdate()

      expect(global.fetch).toHaveBeenNthCalledWith(1, '/player_rushings')
      expect(global.fetch).toHaveBeenNthCalledWith(2, '/player_rushings?search=Chad+Murphy')
    })

    it('displays the search results player rushings', async () => {
      const component = render(<PlayerRushings />)

      await waitForComponentAsyncUpdate()

      const searchBox = component.getByRole('searchbox')
      fireEvent.change(searchBox, { target: { value: 'Chad Murphy' } })
      const searchButton = component.getByLabelText('search')
      fireEvent.click(searchButton)

      await waitForComponentAsyncUpdate()

      const table = component.getByRole('table')
      const rows = within(table).getAllByRole('row')

      expect(rows.length).toEqual(searchResults.length + 1)
      expect(component.getByText('Chad Murphy')).toBeInTheDocument()
    })
  })

  describe('when the player rushings query is successfull', () => {
    const playerRushings = [{ player_name: 'name' }]
    
    beforeEach(() => {
      const anyGlobal: any = global
      anyGlobal.fetch = jest.fn(() => {
        return Promise.resolve({ status: 200, json: () => Promise.resolve(playerRushings) })
      })
    })

    it('shows no error alert', async() => {
      const component = render(<PlayerRushings />)
  
      await waitForComponentAsyncUpdate()

      expect(component.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows table of player rushings', async () => {
      const component = render(<PlayerRushings />)

      await waitForComponentAsyncUpdate()

      const table = component.getByRole('table')
      const rows = within(table).getAllByRole('row')

      expect(rows.length).toEqual(playerRushings.length + 1)
    })
  })

  describe('when the player rushings query fails', () => {
    beforeEach(() => {
      const anyGlobal: any = global
      anyGlobal.fetch = jest.fn(() => {
        return Promise.reject(new Error('Error in fetch'))
      })
    })

    it('shows an error alert message', async () => {
      const component = render(<PlayerRushings />)

      await waitForComponentAsyncUpdate()

      const alert = within(component.getByRole('alert'))

      expect(alert.getByText('Error in fetch')).toBeInTheDocument()
    })

    describe('when the error has no message', () => {
      beforeEach(() => {
        const anyGlobal: any = global
        anyGlobal.fetch = jest.fn(() => {
          return Promise.reject(new Error())
        })
      })

      it('shows a default error alert message', async () => {
        const component = render(<PlayerRushings />)
  
        await waitForComponentAsyncUpdate()
  
        const alert = within(component.getByRole('alert'))

        expect(
          alert.getByText(
            "We couldn't find out what went wrong. Please contact our support team!"
          )
        ).toBeInTheDocument()
      })
    })
  })
})