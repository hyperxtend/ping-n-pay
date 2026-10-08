import apiClient from './client'

export const mfaApi = {
  status: async (): Promise<{ mfaEnabled: boolean }> => {
    const res = await apiClient.get('/mfa/status')
    return res.data
  },

  beginEnrol: async (): Promise<{ secret: string; qrCodeBase64: string; otpAuthUrl: string }> => {
    const res = await apiClient.post('/mfa/enrol')
    return res.data
  },

  confirmEnrol: async (code: number): Promise<string[]> => {
    const res = await apiClient.post('/mfa/enrol/confirm', { code })
    return res.data // array of backup codes
  },

  disable: async (code: number): Promise<void> => {
    await apiClient.post('/mfa/disable', { code })
  },

  verify: async (mfaPendingToken: string, code: string): Promise<{
    accessToken: string
    refreshToken: string
    tokenType: string
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: string
      organisationId: string
      organisationName: string
    }
  }> => {
    const res = await apiClient.post('/auth/mfa-verify', { mfaPendingToken, code })
    return res.data
  },
}
