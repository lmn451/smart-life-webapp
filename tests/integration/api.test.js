import { describe, it, expect, beforeEach, vi } from 'vitest'
import tuyaModule from '@/libs/tuya'

const { HomeAssistantClient } = tuyaModule

// Integration tests for API flow
describe('API Integration', () => {
  let client

  beforeEach(() => {
    global.fetch = vi.fn()
    client = new HomeAssistantClient()
  })

  it('should complete full login and device fetch flow', async () => {
    // Mock successful login
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({
        access_token: 'integration-token',
        refresh_token: 'integration-refresh',
        expires_in: 7200
      })
    })

    // Mock successful device list
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({
        header: { code: 'SUCCESS' },
        payload: {
          devices: [
            { id: 'dev1', name: 'Living Room Light', dev_type: 'light', data: {}, icon: '' },
            { id: 'dev2', name: 'Bedroom Switch', dev_type: 'switch', data: {}, icon: '' },
            { id: 'scene1', name: 'Good Morning', dev_type: 'scene', data: {}, icon: '' }
          ]
        }
      })
    })

    // Perform login
    await client.login('test@example.com', 'password', 'eu')
    const session = client.getSession()
    expect(session).toBeDefined()
    expect(session.token.access_token).toBe('integration-token')

    // Fetch devices with token
    const devicesResult = await client.deviceDiscovery()
    expect(devicesResult.header.code).toBe('SUCCESS')
    expect(devicesResult.payload.devices.length).toBe(3)
  })

  it('should handle device control flow', async () => {
    // Mock login
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({
        access_token: 'test-token',
        refresh_token: 'refresh-token',
        expires_in: 7200
      })
    })

    await client.login('test@example.com', 'password', 'eu')

    // Mock device control
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ header: { code: 'SUCCESS' } })
    })

    // Turn device on
    await client.deviceControl('dev123', 'turnOnOff', true)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/homeassistant/skill'),
      expect.objectContaining({
        method: 'POST'
      })
    )
  })

  it('should handle API errors gracefully', async () => {
    // Mock failed login
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({
        responseStatus: 'error',
        errorMsg: 'Unauthorized'
      })
    })

    await expect(client.login('bad@email.com', 'wrong', 'eu'))
      .rejects.toThrow('Unauthorized')
  })

  it('should handle network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(client.login('test@example.com', 'password', 'eu'))
      .rejects.toThrow('Network error')
  })
})
