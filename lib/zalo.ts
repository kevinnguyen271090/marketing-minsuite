import axios from 'axios'

const ZALO_OA_API_URL = 'https://openapi.zalo.me/v3.0/oa'

export interface ZaloMessage {
  recipient: {
    user_id: string
  }
  message: {
    text: string
    attachment?: {
      type: string
      payload: any
    }
  }
}

export class ZaloOAClient {
  private accessToken: string

  constructor(accessToken?: string) {
    this.accessToken = accessToken || process.env.ZALO_OA_ACCESS_TOKEN || ''
  }

  /**
   * Send text message to user via Zalo OA
   */
  async sendTextMessage(userId: string, message: string): Promise<boolean> {
    try {
      if (!this.accessToken) {
        console.error('Zalo OA access token not configured')
        return false
      }

      const response = await axios.post(
        `${ZALO_OA_API_URL}/message`,
        {
          recipient: {
            user_id: userId,
          },
          message: {
            text: message,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            access_token: this.accessToken,
          },
        }
      )

      return response.data.error === 0
    } catch (error) {
      console.error('Error sending Zalo message:', error)
      return false
    }
  }

  /**
   * Send alert message about campaign
   */
  async sendCampaignAlert(
    userId: string,
    campaignName: string,
    alertType: string,
    details: Record<string, any>
  ): Promise<boolean> {
    const messages: Record<string, string> = {
      ROI_NEGATIVE: `⚠️ CẢNH BÁO: Chiến dịch "${campaignName}" đang có ROI âm!\n\n` +
                    `📊 Chi tiết:\n` +
                    `• ROI: ${details.roi}%\n` +
                    `• Chi phí: ${details.spent} VND\n` +
                    `• Doanh thu: ${details.revenue} VND\n\n` +
                    `Vui lòng kiểm tra và điều chỉnh chiến dịch.`,

      BUDGET_THRESHOLD: `⚠️ CẢNH BÁO: Chiến dịch "${campaignName}" đã sử dụng ${details.budgetUsage}% ngân sách!\n\n` +
                        `📊 Chi tiết:\n` +
                        `• Ngân sách: ${details.budget} VND\n` +
                        `• Đã chi: ${details.spent} VND\n` +
                        `• Còn lại: ${details.remaining} VND\n\n` +
                        `Xem xét tăng ngân sách hoặc tạm dừng chiến dịch.`,

      REVENUE_DROP: `📉 CẢNH BÁO: Doanh thu chiến dịch "${campaignName}" giảm ${details.dropPercentage}%!\n\n` +
                    `📊 Chi tiết:\n` +
                    `• Doanh thu trước: ${details.previousRevenue} VND\n` +
                    `• Doanh thu hiện tại: ${details.currentRevenue} VND\n\n` +
                    `Kiểm tra và tối ưu chiến dịch ngay.`,

      CAMPAIGN_COMPLETED: `✅ Chiến dịch "${campaignName}" đã hoàn thành!\n\n` +
                          `📊 Kết quả:\n` +
                          `• ROI: ${details.roi}%\n` +
                          `• Doanh thu: ${details.revenue} VND\n` +
                          `• Chi phí: ${details.spent} VND\n` +
                          `• Chuyển đổi: ${details.conversions}\n\n` +
                          `Xem báo cáo chi tiết tại MinSuite.`,
    }

    const message = messages[alertType] || `Cảnh báo cho chiến dịch "${campaignName}"`

    return this.sendTextMessage(userId, message)
  }

  /**
   * Send daily report
   */
  async sendDailyReport(
    userId: string,
    campaigns: Array<{
      name: string
      roi: number
      revenue: number
      spent: number
      conversions: number
    }>
  ): Promise<boolean> {
    const today = new Date().toLocaleDateString('vi-VN')

    let message = `📊 BÁO CÁO MARKETING - ${today}\n\n`

    campaigns.forEach((campaign, index) => {
      message += `${index + 1}. ${campaign.name}\n`
      message += `   • ROI: ${campaign.roi.toFixed(2)}%\n`
      message += `   • Doanh thu: ${campaign.revenue.toLocaleString()} VND\n`
      message += `   • Chi phí: ${campaign.spent.toLocaleString()} VND\n`
      message += `   • Chuyển đổi: ${campaign.conversions}\n\n`
    })

    message += `Xem chi tiết tại MinSuite Dashboard.`

    return this.sendTextMessage(userId, message)
  }
}

// Singleton instance
export const zaloClient = new ZaloOAClient()
