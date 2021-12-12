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

const mockResponse = jest.fn();
    Object.defineProperty(window, "location", {
      value: {
        hash: {
          endsWith: mockResponse,
          includes: mockResponse
        },
        assign: mockResponse
      },
      writable: true
    });

describe('Player rushings page', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();

    const anyGlobal: any = global
    anyGlobal.fetch = jest.fn(() => {
      return Promise.resolve({ status: 200, json: () => Promise.resolve([]), blob: () => Promise.resolve('response-blob') })
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

    expect(global.fetch).toHaveBeenCalledWith('/player_rushings?page=1')
  })

  describe('when the user searches for a player name', () => {
    const searchResults = { data: [{ player_name: 'Chad Murphy' }], pagination: { total_hits: 1, current_page: 1, total_pages: 1 } }
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

      expect(global.fetch).toHaveBeenNthCalledWith(1, '/player_rushings?page=1')
      expect(global.fetch).toHaveBeenNthCalledWith(2, '/player_rushings?page=1&search=Chad+Murphy')
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

      expect(rows.length).toEqual(searchResults.data.length + 1)
      expect(component.getByText('Chad Murphy')).toBeInTheDocument()
    })
  })

  describe('when the player rushings query is successfull', () => {
    const playerRushings = { data: [{ player_name: 'name' }], pagination: { total_hits: 1, current_page: 1, total_pages: 1 } }
    
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

      expect(rows.length).toEqual(playerRushings.data.length + 1)
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
    const allRushings = { data: [{ player_name: 'name' }], pagination: { total_hits: 1, current_page: 1, total_pages: 1 }}
    const ascSortedRushings = { data: [{ player_name: 'asc' }], pagination: { total_hits: 1, current_page: 1, total_pages: 1 }}
    const descSortedRushings = { data: [{ player_name: 'desc' }], pagination: { total_hits: 1, current_page: 1, total_pages: 1 }}

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
        expect(component.getByText(allRushings.data[0].player_name)).toBeInTheDocument()

        fireEvent.click(component.getByText('Total touchdowns'))
  
        await waitForComponentAsyncUpdate()
        expect(component.getByText(ascSortedRushings.data[0].player_name)).toBeInTheDocument() 

        fireEvent.click(component.getByText('Total touchdowns'))
  
        await waitForComponentAsyncUpdate()
        expect(component.getByText(descSortedRushings.data[0].player_name)).toBeInTheDocument() 

        expect(global.fetch).toHaveBeenNthCalledWith(1, '/player_rushings?page=1')
        expect(global.fetch).toHaveBeenNthCalledWith(2, '/player_rushings?page=1&sort_by=total_touchdowns&order_by=asc')
        expect(global.fetch).toHaveBeenNthCalledWith(3, '/player_rushings?page=1&sort_by=total_touchdowns&order_by=desc')
      })
    })
  
    describe('when the users clicks in longest rush header', () => {
      it('fetches player rushings ordered longest rush', async () => {
        const component = render(<PlayerRushings />)
    
        await waitForComponentAsyncUpdate()
        expect(component.getByText(allRushings.data[0].player_name)).toBeInTheDocument()

        fireEvent.click(component.getByText('Longest rush'))

        await waitForComponentAsyncUpdate()
        expect(component.getByText(ascSortedRushings.data[0].player_name)).toBeInTheDocument() 

        fireEvent.click(component.getByText('Longest rush'))
  
        await waitForComponentAsyncUpdate()
        expect(component.getByText(descSortedRushings.data[0].player_name)).toBeInTheDocument() 

        expect(global.fetch).toHaveBeenNthCalledWith(1, '/player_rushings?page=1')
        expect(global.fetch).toHaveBeenNthCalledWith(2, '/player_rushings?page=1&sort_by=longest_rush&order_by=asc')
        expect(global.fetch).toHaveBeenNthCalledWith(3, '/player_rushings?page=1&sort_by=longest_rush&order_by=desc')
      })
    })
  
    describe('when the users clicks in total rushing yards', () => {
      it('fetches player rushings ordered total rushing yards', async () => {
        const component = render(<PlayerRushings />)
  
    
        await waitForComponentAsyncUpdate()
        expect(component.getByText(allRushings.data[0].player_name)).toBeInTheDocument()
        
        fireEvent.click(component.getByText('Total rushing yards'))
  
        await waitForComponentAsyncUpdate()
        expect(component.getByText(ascSortedRushings.data[0].player_name)).toBeInTheDocument() 

        fireEvent.click(component.getByText('Total rushing yards'))
  
        await waitForComponentAsyncUpdate()
        expect(component.getByText(descSortedRushings.data[0].player_name)).toBeInTheDocument() 

        expect(global.fetch).toHaveBeenNthCalledWith(1, '/player_rushings?page=1')
        expect(global.fetch).toHaveBeenNthCalledWith(2, '/player_rushings?page=1&sort_by=total_rushing_yards&order_by=asc')
        expect(global.fetch).toHaveBeenNthCalledWith(3, '/player_rushings?page=1&sort_by=total_rushing_yards&order_by=desc')
      })
    })
  })

  describe('pagination', () => {
    const firstResponse = { data: [{ player_name: 'name' }], pagination: { total_hits: 20*15, current_page: 1, total_pages: 1 } }
    const response = { data:[{ player_name: 'testt' }], pagination: { total_hits: 20*15, current_page: 5, total_pages: 15 } }

    beforeEach(() => {
      const anyGlobal: any = global
      anyGlobal.fetch = jest.fn()
                            .mockReturnValueOnce(Promise.resolve({ status: 200, json: () => Promise.resolve(firstResponse) }))
                            .mockReturnValueOnce(Promise.resolve({ status: 200, json: () => Promise.resolve(response) }))
                            
    }) 

    it('starts at page 1', async () => {
      render(<PlayerRushings />)

      await waitForComponentAsyncUpdate()

      expect(global.fetch).toHaveBeenCalledWith('/player_rushings?page=1')
    })

    it('displays options to access the 5 available pages around current page', async () => {
      const component = render(<PlayerRushings />)

      await waitForComponentAsyncUpdate()

      fireEvent.click(component.getByTitle('5'))

      await waitForComponentAsyncUpdate()

      expect(component.getByTitle(3)).toBeInTheDocument()
      expect(component.getByTitle(4)).toBeInTheDocument()
      expect(component.getByTitle(5)).toBeInTheDocument()
      expect(component.getByTitle(6)).toBeInTheDocument()
      expect(component.getByTitle(7)).toBeInTheDocument()
    })

    describe('when page changes', () => {
      it('fetches player rushings for the next page', async () => {
        const component = render(<PlayerRushings />)

        await waitForComponentAsyncUpdate()

        fireEvent.click(component.getByTitle(5))

        await waitForComponentAsyncUpdate()

        expect(global.fetch).toHaveBeenCalledWith('/player_rushings?page=5')
      })

      it('displays players for the new page', async () => {
        const component = render(<PlayerRushings />)

        await waitForComponentAsyncUpdate()

        fireEvent.click(component.getByTitle(5))

        await waitForComponentAsyncUpdate()

        expect(global.fetch).toHaveBeenCalledWith('/player_rushings?page=5')
        expect(component.getByText(response.data[0].player_name)).toBeInTheDocument()
      })
    })
  })

  describe('when clicks download button', () => {
    it('fetches csv file from server', async () => {
      const component = render(<PlayerRushings />)

      await waitForComponentAsyncUpdate()

      fireEvent.click(component.getByRole('button', { name: 'download CSV' }))

      expect(global.fetch).toHaveBeenCalledWith('/player_rushings.csv?page=1', { headers: {
        'Content-Type': 'text/csv'
      }})
    })

    it('fetches csv file from server with sorting and search', async () => {
      const component = render(<PlayerRushings />)

      await waitForComponentAsyncUpdate()

      fireEvent.click(component.getByText('Total rushing yards'))
      await waitForComponentAsyncUpdate()

      const searchBox = component.getByRole('searchbox')
      fireEvent.change(searchBox, { target: { value: 'Chad Murphy' } })
      const searchButton = component.getByLabelText('search')
      fireEvent.click(searchButton)

      await waitForComponentAsyncUpdate()

      fireEvent.click(component.getByRole('button', { name: 'download CSV' }))

      expect(global.fetch).toHaveBeenCalledWith('/player_rushings.csv?page=1&search=Chad+Murphy&sort_by=total_rushing_yards&order_by=asc', { headers: {
        'Content-Type': 'text/csv'
      }})
    })

    it('creates a blob with the request result', async () => {
      const component = render(<PlayerRushings />)

      await waitForComponentAsyncUpdate()

      fireEvent.click(component.getByRole('button', { name: 'download CSV' }))

      await waitForComponentAsyncUpdate()

      expect(global.URL.createObjectURL).toHaveBeenCalledWith('response-blob')
    })
  })
})