import { act } from '@testing-library/react'

export const waitForComponentAsyncUpdate = async () => {
  await act(() =>
    new Promise((resolve, _) => setTimeout(resolve, 0))
  )
}
