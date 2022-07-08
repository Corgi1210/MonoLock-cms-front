import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail: email,
          password,
        }),
      });
      let data = await response.json();
      if (response.status === 200) {
        localStorage.setItem("token", data.message.token);
        return data;
      } else {
        throw data.message;
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.REACT_APP_URL}/api/logout`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: token,
      },
    });
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const userInfo = createAsyncThunk(
  "user/info",
  async (lockerNo, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/record/${lockerNo}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token,
          },
        }
      ).then((response) => {
        if (response.status === 200) {
          return response;
        }
        if (response.status === 400) {
          return response.text();
        }
        if (response.status === 401) {
          if (token !== "") {
            localStorage.clear();
            alert("請重新登入");
            window.location.reload();
          }
        }
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw response;
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const userUnlock = createAsyncThunk(
  "user/unlock",
  async (inputData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      return await fetch(`${process.env.REACT_APP_URL}/api/unlock`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          lockerNo: inputData[0].lockerNo,
          description: inputData[0].description,
        }),
      }).then((response) => {
        if (response.status === 200) {
          return 0;
        }
        if (response.status === 401) {
          if (token !== "") {
            localStorage.clear();
            alert("請重新登入");
            window.location.reload();
          }
        }
        return 1;
      });
      // let data = response;
      // if (response.ok) {
      //   return data;
      // } else {
      //   throw data;
      // }
    } catch (e) {
      console.log(e.response.status);
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const userUpdate = createAsyncThunk(
  "user/update",
  async ({ id, name, email, phone, cardId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/user/${id}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({
            name,
            mail: email,
            phone,
            cardId,
          }),
        }
      ).then((response) => {
        if (response.status === 200) {
          return response;
        }
        if (response.status === 400) {
          return response.json();
        }
        if (response.status === 401) {
          if (token !== "") {
            localStorage.clear();
            alert("請重新登入");
            window.location.reload();
          }
        }
      });
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const userAdd = createAsyncThunk(
  "user/Add",
  async ({ lockerNo, name, email, phone, cardId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_URL}/api/user`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          lockerNo,
          name,
          mail: email,
          phone,
          cardId,
        }),
      }).then((response) => {
        if (response.status === 200) {
          return response;
        }
        if (response.status === 401) {
          if (token !== "") {
            localStorage.clear();
            alert("請重新登入");
            window.location.reload();
          }
        }
      });
      let data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw data;
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const userDelete = createAsyncThunk(
  "user/delete",
  async ({ id }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/user/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token,
          },
        }
      ).then((response) => {
        if (response.status === 200) {
          return response;
        }
        if (response.status === 401) {
          if (token !== "") {
            localStorage.clear();
            alert("請重新登入");
            window.location.reload();
          }
        }
      });
      if (response.ok) {
        return response;
      } else {
        throw response;
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: "",
    name: "",
    user: [],
    records: [],
    isFetching: false,
    isSuccess: false,
    isError: false,
    updating: false,
    userClear: false,
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      state.userClear = false;
      return state;
    },
    clearToken: (state) => {
      state.token = "";

      return state;
    },
    clearMsg: (state) => {
      state.errorMessage = "";

      return state;
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.name = payload.message.name;
      state.token = payload.message.token;
      localStorage.setItem("name", payload.message.name);
      return state;
    },
    [login.pending]: (state) => {
      state.isFetching = true;
      return state;
    },
    [login.rejected]: (state) => {
      state.isFetching = false;
      state.isError = true;
      return state;
    },
    [userUpdate.fulfilled]: (state) => {
      state.updating = false;
      state.isSuccess = true;
      state.errorMessage = "";
      return state;
    },
    [userUpdate.pending]: (state) => {
      state.updating = true;
      return state;
    },
    [userUpdate.rejected]: (state, { payload }) => {
      state.updating = false;
      state.isError = true;
      state.errorMessage = payload.cardId;
      return state;
    },
    [userInfo.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.user = payload.user;
      state.records = payload.records;
      return state;
    },
    [userInfo.pending]: (state) => {
      state.isFetching = true;
      return state;
    },
    [userInfo.rejected]: (state) => {
      state.isFetching = false;
      state.user = [];
      state.records = [];
      return state;
    },
    [userUnlock.fulfilled]: (state) => {
      state.isFetching = false;
      state.isSuccess = true;
      return state;
    },
    [userUnlock.pending]: (state) => {
      state.isFetching = true;
      return state;
    },
    [userUnlock.rejected]: (state) => {
      state.isFetching = false;
      return state;
    },
    [userAdd.fulfilled]: (state) => {
      state.updating = false;
      state.isSuccess = true;
      return state;
    },
    [userAdd.pending]: (state) => {
      state.updating = true;
      return state;
    },
    [userAdd.rejected]: (state) => {
      state.updating = false;
      state.isError = true;
      return state;
    },
    [logout.fulfilled]: (state) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.isError = false;
      return state;
    },
    [logout.pending]: (state) => {
      state.isFetching = true;
      return state;
    },
    [logout.rejected]: (state) => {
      state.isFetching = false;
      state.isError = true;
      return state;
    },
    [userDelete.fulfilled]: (state) => {
      state.updating = false;
      state.isSuccess = true;
      state.userClear = true;
      return state;
    },
    [userDelete.pending]: (state) => {
      state.updating = true;
      return state;
    },
    [userDelete.rejected]: (state) => {
      state.updating = false;
      return state;
    },
  },
});

export const { clearState, clearToken, clearMsg } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
