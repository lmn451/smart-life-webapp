import { describe, it, expect, beforeEach, vi } from 'vitest'
import tuyaModule from '@/libs/tuya'

const { HomeAssistantClient } = tuyaModule

// Mock fetch globally
global.fetch = vi.fn()

describe('Tuya API Library', () => {
  let client

  beforeEach(() => {
    fetch.mockClear()
    client = new HomeAssistantClient()
  })

  describe('login', () => {
    it('should call auth.do endpoint with correct parameters', async () => {
      const mockResponse = {
        access_token: 'test-token',
        refresh_token: 'refresh-token',
        expires_in: 7200
      }

      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => mockResponse
      })

      await client.login('test@example.com', 'password123', 'eu')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/homeassistant/auth.do?region=eu'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: expect.stringContaining('userName=test%40example.com')
        })
      )
      
      const session = client.getSession()
      expect(session).toBeDefined()
      expect(session.token.access_token).toBe('test-token')
    })

    it('should handle login failure', async () => {
      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          responseStatus: 'error',
          errorMsg: 'Invalid credentials'
        })
      })

      await expect(client.login('bad@example.com', 'wrong', 'eu'))
        .rejects.toThrow('Invalid credentials')
    })
  })

  describe('deviceDiscovery', () => {
    beforeEach(async () => {
      // Login first
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
      fetch.mockClear()
    })

    it('should fetch devices with authorization token', async () => {
      const mockDevices = {
        header: { code: 'SUCCESS' },
        payload: {
          devices: [
            { id: 'device1', name: 'Light 1', dev_type: 'light', data: {}, icon: '' },
            { id: 'device2', name: 'Switch 1', dev_type: 'switch', data: {}, icon: '' }
          ]
        }
      }

      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => mockDevices
      })

      const result = await client.deviceDiscovery()

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/homeassistant/skill?region=eu'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      )
      expect(result.payload.devices).toHaveLength(2)
    })
  })

  describe('deviceControl', () => {
    beforeEach(async () => {
      // Login first
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
      fetch.mockClear()
    })

    it('should send turnOnOff command for device', async () => {
      const mockResponse = { header: { code: 'SUCCESS' } }

      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => mockResponse
      })

      await client.deviceControl('device123', 'turnOnOff', true)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/homeassistant/skill?region=eu'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"name":"turnOnOff"')
        })
      )
    })

    it('should convert boolean to 0/1 for turnOnOff', async () => {
      const mockResponse = { header: { code: 'SUCCESS' } }

      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => mockResponse
      })

      await client.deviceControl('device123', 'turnOnOff', false)

      const callArgs = fetch.mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      expect(body.payload.value).toBe(0)
    })
  })

  describe('session management', () => {
    it('should get session after login', async () => {
      fetch.mockResolvedValue({
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
      const session = client.getSession()

      expect(session).toBeDefined()
      expect(session.region).toBe('eu')
      expect(session.token.access_token).toBe('test-token')
    })

    it('should drop session', async () => {
      fetch.mockResolvedValue({
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
      client.dropSession()

      expect(client.getSession()).toBeNull()
    })
  })
})
