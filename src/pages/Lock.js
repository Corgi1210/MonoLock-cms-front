import React, { useEffect } from "react";
import { lockStatus, lockStatusNoLoading } from "../redux/lockSlice";
import { useDispatch } from "react-redux";

import "./Lock.css";
import LockContent from "../components/LockContent";
import LockStatus from "../components/LockStatus";

import { Box, Paper } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const Luck = () => {
  const dispatch = useDispatch();

  const handleClickRefresh = () => {
    dispatch(lockStatus());
  };

  useEffect(() => {
    dispatch(lockStatus());
    let refresh = setInterval(() => {
      dispatch(lockStatusNoLoading());
    }, 3000);
    return () => clearInterval(refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="Lock">
      <div className="lockHeader">
        置物櫃當前使用狀態
        <RefreshIcon sx={{ cursor: "pointer" }} onClick={handleClickRefresh} />
      </div>
      <div className="lockContainer">
        <div className="lockStatusDisable">
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": {
                width: 128,
                height: 176,
                borderRadius: "10%",
                borderColor: "#000000",
                border: "1px solid ",
              },
            }}
          >
            <Paper className="lockStatusPaper" elevation={0}></Paper>
          </Box>
        </div>
        <div className="lockContent">
          <LockContent />
        </div>
        <div className="lockStatus">
          <LockStatus />
        </div>
      </div>
    </div>
  );
};

export default Luck;
