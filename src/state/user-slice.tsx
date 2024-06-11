import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUsers } from '@/services/users-api';

interface UsersState {
  users: User[];
  filteredUsers: User[];
  status: 'initial' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
  position: [number | null, number | null];
}

const initialState: UsersState = {
  users: [],
  filteredUsers: [],
  status: 'initial',
  error: null,
  position: [null, null],
};

export const getUsersData = createAsyncThunk<User[]>('users/getUsersData', async () => {
  const response = await getUsers();
  return response;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      state.filteredUsers.push(action.payload);
    },
    updatePosition: (state, action: PayloadAction<[number | null, number | null]>) => {
      state.position = action.payload;
    },
    filterList: (state, action: PayloadAction<User[]>) => {
      state.filteredUsers = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersData.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getUsersData.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'fulfilled';
        state.users = action.payload;
        state.filteredUsers = action.payload;
        if (action.payload.length > 0 && action.payload[6]?.address?.geo) {
          state.position = [
            parseFloat(action.payload[6].address.geo.lat),
            parseFloat(action.payload[6].address.geo.lng),
          ];
        }
      })
      .addCase(getUsersData.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message ?? null;
      });
  },
});

export const { addUser, updatePosition, filterList } = userSlice.actions;

export default userSlice.reducer;
