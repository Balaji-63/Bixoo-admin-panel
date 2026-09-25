import { createSlice } from '@reduxjs/toolkit';

const requirementsSlice = createSlice({
  name: 'requirements',
  initialState: {
    items: [],
  },
  reducers: {
    reduceRequirementNeed(state, action) {
      const { reqId, allocatedQty } = action.payload;
      const req = state.items.find(r => r.id === reqId);
      if (req) {
        req.remainingQty = Math.max(0, req.remainingQty - allocatedQty);
      }
    },
  },
});

export const requirementsActions = requirementsSlice.actions;
export default requirementsSlice.reducer;