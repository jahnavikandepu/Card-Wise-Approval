import Application from '../models/Application.js';

/**
 * Generate a sequential application ID in the format CW-XXXX (e.g. CW-1001, CW-1002)
 * @returns {Promise<string>} Generated unique application ID
 */
export const generateApplicationId = async () => {
  try {
    // Find the latest applications to determine highest sequence number
    const latestApps = await Application.find({}, { applicationId: 1 })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    let maxNum = 1000;
    if (latestApps && latestApps.length > 0) {
      for (const app of latestApps) {
        const match = app.applicationId?.match(/^CW-(\d+)$/i);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
      return `CW-${maxNum + 1}`;
    }

    const count = await Application.countDocuments();
    return `CW-${1000 + count + 1}`;
  } catch (error) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `CW-${randomSuffix}`;
  }
};

export default generateApplicationId;
