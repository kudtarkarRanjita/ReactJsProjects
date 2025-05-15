import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Data {
  userId: number;
  id: number;
  title: string;
  body: string;
}
interface DataState {
  items: Data[];
  loading: boolean;
  error: string | null;
}
const initialState: DataState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk("api/fetchData", async () => {
  const response = await axios.get<Data[]>(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data;
});

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch posts";
      });
  },
});

export default postSlice.reducer;
