import axios from 'axios';

const PRAYER_API_BASE = 'https://api.aladhan.com/v1';
const QURAN_API_BASE = 'https://api.alquran.cloud/v1';

export const getPrayerTimes = async (city: string, country: string) => {
    try {
        const response = await axios.get(`${PRAYER_API_BASE}/timingsByCity`, {
            params: { city, country, method: 2 } // Method 2: ISNA
        });
        return response.data.data.timings;
    } catch (error) {
        console.error('Error fetching prayer times', error);
        return null;
    }
};

export const getQuranJuz = async (juz: number) => {
    try {
        const response = await axios.get(`${QURAN_API_BASE}/juz/${juz}/quran-uthmani`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching juz', error);
        return null;
    }
};
