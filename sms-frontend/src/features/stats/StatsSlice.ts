import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface StatsSeriesPoint {
  name: string;
  sent: number;
  failed: number;
}

export interface StatsState {
  deliveredToday: number;
  failedToday: number;
  queueDepth: number;
  activeServers: number;
  series: StatsSeriesPoint[];
  lastUpdated: number | null;
}

const initialState: StatsState = {
  deliveredToday: 12480,
  failedToday: 42,
  queueDepth: 128,
  activeServers: 3,
  series: [
    { name: 'Dush', sent: 4200, failed: 12 },
    { name: 'Sesh', sent: 5100, failed: 18 },
    { name: 'Chor', sent: 4800, failed: 9 },
    { name: 'Pay', sent: 6200, failed: 22 },
    { name: 'Jum', sent: 5900, failed: 15 },
    { name: 'Shan', sent: 7100, failed: 19 },
    { name: 'Yak', sent: 12480, failed: 42 },
  ],
  lastUpdated: null,
};

export type StatsPatch = Partial<Omit<StatsState, 'lastUpdated'>>;

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    patchStats(state, action: PayloadAction<StatsPatch>) {
      Object.assign(state, action.payload);
      state.lastUpdated = Date.now();
    },
  },
});

export const { patchStats } = statsSlice.actions;
export default statsSlice.reducer;
