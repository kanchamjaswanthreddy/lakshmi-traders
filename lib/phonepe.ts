import crypto from 'crypto';
import axios from 'axios';

const PHONEPE_BASE = process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/hermes';

export async function fetchPhonePeTransactions(
  startDate: string,
  endDate: string
) {
  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  const saltKey = process.env.PHONEPE_SALT_KEY;
  const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';

  if (!merchantId || !saltKey) {
    throw new Error('PHONEPE_API_NOT_CONFIGURED');
  }

  const endpoint = '/v3/merchant/transaction/list';
  const payload = {
    merchantId,
    startDate,
    endDate,
    pageIndex: 1,
    pageSize: 50,
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const checksum =
    crypto
      .createHash('sha256')
      .update(base64Payload + endpoint + saltKey)
      .digest('hex') +
    '###' +
    saltIndex;

  const response = await axios.post(
    `${PHONEPE_BASE}${endpoint}`,
    { request: base64Payload },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId,
      },
    }
  );

  return response.data;
}
