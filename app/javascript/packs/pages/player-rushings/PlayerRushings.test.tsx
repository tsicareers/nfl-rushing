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

    expect(global.fetch).toHaveBeenCalledWith('/player_rushings?')
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

      expect(global.fetch).toHaveBeenNthCalledWith(1, '/player_rushings?')
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

  describe('sorting', () => {
    const allRushings = [{ player_name: 'name' }]
    const ascSortedRushings = [{ player_name: 'asc' }]
    const descSortedRushings = [{ player_name: 'desc' }]

    beforeEach(() => {
      const anyGlobal: any = global
      anyGlobal.fetch = jest.fn()
                            .mockReturnValueOnce(Promise.resolve({ status: 200, json: () => Promise.resolve(allRushings) }))
                            .mockReturnValueOnce(Promise.resolve({ status: 200, json: () => Promise.resolve(ascSortedRushings) }))
                            .mockReturnValueOnce(Promise.resolve({ status: 200, json: () => Promise.resolve(descSortedRushings) }))
    }) 

    describe('when the users clicks in total touchdowns header', () => {
      it('fetches player rushings ordered total touch downs', async () => {
        const component = render(<PlayerRushings />)
    
        await waitForComponentAsyncUpdate()
        expect(component.getByText(allRushings[0].player_name)).toBeInTheDocument()

        fireEvent.click(component.getByText('Total touchdowns'))
  
        await waitForComponentAsyncUpdate()
        expect(component.getByText(ascSortedRushings[0].player_name)).toBeInTheDocument() 

        fireEvent.click(component.getByText('Total touchdowns'))
  
        await waitForComponentAsyncUpdate()
        expect(component.getByText(descSortedRushings[0].player_name)).toBeInTheDocument() 

        expect(global.fetch).toHaveBeenNthCalledWith(1, '/player_rushings?')
        expect(global.fetch).toHaveBeenNthCalledWith(2, '/player_rushings?sort_by=total_touchdowns&order_by=asc')
        expect(global.fetch).toHaveBeenNthCalledWith(3, '/player_rushings?sort_by=total_touchdowns&order_by=desc')
      })
    })
  
    describe('when the users clicks in longest rush header', () => {
      it('fetches player rushings ordered longest rush', async () => {
        const component = render(<PlayerRushings />)
    
        await waitForComponentAsyncUpdate()
        expect(component.getByText(allRushings[0].player_name)).toBeInTheDocument()

        fireEvent.click(component.getByText('Longest rush'))

        await waitForComponentAsyncUpdate()
        expect(component.getByText(ascSortedRushings[0].player_name)).toBeInTheDocument() 

        fireEvent.click(component.getByText('Longest rush'))
  
        await waitForComponentAsyncUpdate()
        expect(component.getByText(descSortedRushings[0].player_name)).toBeInTheDocument() 

        expect(global.fetch).toHaveBeenNthCalledWith(1, '/player_rushings?')
        expect(global.fetch).toHaveBeenNthCalledWith(2, '/player_rushings?sort_by=longest_rush&order_by=asc')
        expect(global.fetch).toHaveBeenNthCalledWith(3, '/player_rushings?sort_by=longest_rush&order_by=desc')
      })
    })
  
    describe('when the users clicks in total rushing yards', () => {
      it('fetches player rushings ordered total rushing yards', async () => {
        const component = render(<PlayerRushings />)
  
    
        await waitForComponentAsyncUpdate()
        expect(component.getByText(allRushings[0].player_name)).toBeInTheDocument()
        
        fireEvent.click(component.getByText('Total rushing yards'))
  
        await waitForComponentAsyncUpdate()
        expect(component.getByText(ascSortedRushings[0].player_name)).toBeInTheDocument() 

        fireEvent.click(component.getByText('Total rushing yards'))
  
        await waitForComponentAsyncUpdate()
        expect(component.getByText(descSortedRushings[0].player_name)).toBeInTheDocument() 

        expect(global.fetch).toHaveBeenNthCalledWith(1, '/player_rushings?')
        expect(global.fetch).toHaveBeenNthCalledWith(2, '/player_rushings?sort_by=total_rushing_yards&order_by=asc')
        expect(global.fetch).toHaveBeenNthCalledWith(3, '/player_rushings?sort_by=total_rushing_yards&order_by=desc')
      })
    })
  })
})